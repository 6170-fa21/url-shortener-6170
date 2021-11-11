<template>
  <div :class="popular ? 'short-container-popular' : 'short-container'">
    <div class="short-name"> {{ short.short_name }}</div>
    <p>Creator ID: {{ creatorIdentity }}</p>
    <p>Number of times visited: {{ visitCount }}</p>
    <p>Short URL: <a target="_blank" v-bind:href=" 'http://localhost:3000/' + short.short_name" v-on:click="incrementShortCount">
      http://localhost:3000/{{short.short_name}}
    </a> </p>
    <a target="_blank" v-bind:href="short.short_original_url">
      {{ short.short_original_url }}
    </a>
    <div class="short-item-actions">
      <input class="edit" v-model.trim='url' type="text" name="url" placeholder="New Url">
      <button v-on:click="updateShort">Update</button>
      <button v-on:click="deleteShort">Delete</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "ShortListItem",

  props: {
    short: Object,
    popular: Boolean
  },

  data() {
    return {
      url: "",
    };
  },

  computed: {
    creatorIdentity: function() {
      if(this.short.shortwithusers.length !== 0){
        return this.short.shortwithusers[0].user_name;
      }
      return "anonymous";
    },
    visitCount: function() {
      return this.short.short_visit_count;
    }
  },

  methods: {
    updateShort: function() {
      const body = { url: this.url, isCount: false};
      axios
        .put(`/api/shorts/${this.short.short_name}`, body)
        .then(() => {
          // handle success
          eventBus.$emit("update-short-success", this.short);
        })
        .catch(() => {
          // handle error
          eventBus.$emit("update-short-error", this.short);
        })
        .then(() => (this.url = ""));
    },

    deleteShort: function() {
      axios
        .delete(`/api/shorts/${this.short.short_name}`, {})
        .then(() => {
          eventBus.$emit("delete-short-success", this.short);
        })
        .catch(() => {
          eventBus.$emit("delete-short-error", this.short);
        });
    },

    incrementShortCount: function() {
      const body = { url: this.url, isCount: true};
      axios
        .put(`/api/shorts/${this.short.short_name}`, body)
        .then(() => {
          eventBus.$emit("increment-short-success", this.short);
        })
        .catch(() => {
          eventBus.$emit("increment-short-error", this.short);
        });
    }
  }
};
</script>