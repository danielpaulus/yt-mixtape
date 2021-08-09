<template>
<div class="flex p-6 font-mono">
    <div class="flex-none w-40 relative">
        <img src="/retro-shoe.jpg" alt="" class="absolute inset-0 w-full h-full object-cover border border-black shadow-offset-lime" />
    </div>
    <form class="flex-auto pl-6">
        <div class="flex flex-wrap items-baseline pl-52 -mt-6 -mr-6 -ml-52 py-6 pr-6 bg-black text-white">
            <h1 class="w-full flex-none text-2xl leading-7 mb-2 font-bold">
                Retro Shoe
            </h1>
            <div class="text-2xl leading-7 font-bold">
                $89.00
            </div>
            <div class="text-sm font-medium ml-3">
                In stock
            </div>
        </div>
        <div class="flex items-baseline py-8">
            <div class="space-x-3.5 flex text-center text-sm leading-none font-bold text-gray-500">
                <label>
                    <input class="w-6 text-black shadow-underline" name="size" type="radio" value="xs" checked>
                    XS
                </label>
                <label>
                    <input class="w-6" name="size" type="radio" value="s">
                    S
                </label>
                <label>
                    <input class="w-6" name="size" type="radio" value="m">
                    M
                </label>
                <label>
                    <input class="w-6" name="size" type="radio" value="l">
                    L
                </label>
                <label>
                    <input class="w-6" name="size" type="radio" value="xl">
                    XL
                </label>
            </div>
            <div class="ml-auto text-xs underline">Size Guide</div>
        </div>
        <div class="flex space-x-3 text-sm font-bold uppercase mb-4">
            <div class="flex-auto flex space-x-3">
                <audio controls>
  <source src="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3" type="audio/mpeg">
  Your browser does not support the audio tag.
</audio>
                <button class="w-1/2 flex items-center justify-center bg-lime-300 text-black border border-black shadow-offset-black" type="submit">Buy now</button>
                <button class="w-1/2 flex items-center justify-center border border-black shadow-offset-black" type="button">Add to bag</button>
            </div>
            <button class="flex-none flex items-center justify-center w-9 h-9 border border-black" type="button" aria-label="like">
                <svg width="20" height="20" fill="currentColor">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
            </button>
        </div>
        <p class="text-xs leading-5 text-gray-500">
            Free shipping on all continental US orders.
        </p>
    </form>
</div>

</template>

<style scoped>
</style>

<script>
import axios from "axios"
export default {
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
        const results = response.data
        console.log(results)
        this.tracks = results.map(post => ({
          title: post.title,
          abstract: post.abstract,
          url: post.url,
          //thumbnail: this.extractImage(post).url,
          //caption: this.extractImage(post).caption,
          byline: post.byline,
          published_date: post.published_date,
        }))
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