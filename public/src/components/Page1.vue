<template>
<TrackList :tracks="tracks"/>
</template>

<style scoped>
</style>

<script>
import axios from "axios"
import TrackList from './TrackList.vue'
export default {
    components:{TrackList},
     data() {
    return {
      section: "home",
      tracks: [],
    }
},
methods: {
     async fetchNews() {
      try {
        const url = `http://localhost:8000/mediainfo`
        const response = await axios.get(url)
        this.tracks = response.data
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          console.log("Server Error:", err)
        } else if (err.request) {
          // client never received a response, or request never left
          console.log("Network Error:", err)
        } else {
          console.log("Client Error:", err)
        }
      }
    },
  },
  mounted() {
    this.fetchNews()
  },
}

</script>