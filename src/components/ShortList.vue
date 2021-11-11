<template>
  <div class="subcontainer">
    <div class="header secondary-header">
      Shorts
    </div>
    <div>
      <div v-if='success' class="success-message">
        {{ success }}
      </div>
      <div v-if='error' class="error-message">
        {{ error }}
      </div>

      <div class="shorts-container">  
        <div v-if="shorts.length">
          <!-- TODO: pass props to popular shorts -->
          <ShortListItem
            v-for="short in shorts.slice(0, 3)"
            v-bind:key="short._id"
            v-bind:short="short"
            v-bind:popular="true"
          />
          <ShortListItem
            v-for="short in shorts.slice(3)"
            v-bind:key="short._id"
            v-bind:short="short"
            v-bind:popular="false"
          />
        </div>
        <div v-else>
          <p style="text-align: center;">There are no shorts to display. Create one today!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ShortListItem from "./ShortListItem";

import { eventBus } from "../main";

export default {
  name: "ShortList",

  components: { ShortListItem },

  data() {
    return {
      error: "",
      success: "",
      shorts: []
    };
  },

  created: function() {
    eventBus.$on("create-short-success", res => {
      this.shorts.unshift(res.data);
    });

    eventBus.$on("update-short-success", res => {
      this.success = `Short name ${res.short_name} now resolves to ${
        res.short_original_url
      }`;
      this.clearMessages();
      this.loadShorts();
    });

    eventBus.$on("increment-short-success", res => {
      this.success = `Short name ${res.short_name} has been visited`;
      this.clearMessages();
      this.loadShorts();
    })

    eventBus.$on("delete-short-success", res => {
      this.success = `Short name ${res.short_name} has been deleted`;
      this.clearMessages();
      this.loadShorts();
    });

    eventBus.$on("update-short-error", res => {
      this.error = `Error updating short ${res.short_name}`;
      this.clearMessages();
      this.loadShorts();
    });

    eventBus.$on("delete-short-error", res => {
      this.error = `Error deleting short ${res.short_name}`;
      this.clearMessages();
      this.loadShorts();
    });

    eventBus.$on("increment-short-error", res => {
      this.error = `Error visiting short ${res.short_name}`;
      this.clearMessages();
    });
  },

  mounted: function() {
    this.loadShorts();
  },

  methods: {
    loadShorts: function() {
      axios.get("/api/shorts")
        .then(response => {
          this.shorts = response.data;
        })
        .then(() => {
          this.shorts = this.shorts.sort(
            (a, b) => {return b["short_visit_count"] - a["short_visit_count"];}
          );
        })
    },

    clearMessages: function() {
      setInterval(() => {
        this.success = "";
        this.error = "";
      }, 5000);
    }
  }
};
</script>