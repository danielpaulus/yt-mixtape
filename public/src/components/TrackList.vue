<template>
<div>
    {{currentTrack}}
            <audio ref="player" controls>
  <source v-bind:src="currentTrack" type="audio/mpeg">
  
  
  Your browser does not support the audio tag.
</audio>
    <div v-for="(track, index) in tracks" :key="index" :track="track" class="flex p-6 font-mono">
    <div class="flex-none w-40 relative">
        <img src="/retro-shoe.jpg" alt="" class="absolute inset-0 w-full h-full object-cover border border-black shadow-offset-lime" />
    </div>
    <form class="flex-auto pl-6">
        <div class="flex flex-wrap items-baseline pl-52 -mt-6 -mr-6 -ml-52 py-6 pr-6 bg-black text-white">
            <h1 class="w-full flex-none text-2xl leading-7 mb-2 font-bold">
                {{track.title}}
            </h1>
            <div class="text-2xl leading-7 font-bold">
                {{track.uploadedBy}}
            </div>
            <div class="text-sm font-medium ml-3">
                In stock
            </div>
        </div>
        <div class="flex items-baseline py-8">
            <div class="space-x-3.5 flex text-center text-sm leading-none font-bold text-gray-500">
                <label v-show="isAvailableOffline(track.id)">
                    <input class="w-6 text-black shadow-underline" name="size" type="radio" value="xs" checked>
                    available offline
                </label>
    
                <label v-show="!isAvailableOffline(track.id)">
                    <input class="w-6" name="size" type="radio" value="s">
                    not available offline
                </label>
                
            </div>
            <div class="ml-auto text-xs underline">Size Guide</div>
        </div>
        <div class="flex space-x-3 text-sm font-bold uppercase mb-4">
            <div class="flex-auto flex space-x-3">
        
                <button v-on:click="storeDb(track.id)" class="w-1/2 flex items-center justify-center bg-lime-300 text-black border border-black shadow-offset-black" type="submit">Download</button>
                <button v-on:click="createSource(track.id)" class="w-1/2 flex items-center justify-center border border-black shadow-offset-black" type="button">play</button>
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
</div>
</template>
<script>
import Dexie from 'dexie'
  var db = new Dexie("MyImgDb");
db.version(1).stores({
    friends: "name"
});

export default {
  props: {
tracks: {
      type: Array,
      required: true,
    },
  },
     data() {
    return {
      currentTrack: "none.mp3",
    }
},
mounted: function () {
  	this.$watch('currentTrack', function () {
    	this.$refs.player.load()
        this.$refs.player.play()
    })
  },
  methods: {
  async storeDb(id) {
    const res = await fetch("media/"+id+".mp3");
    console.log("download done")
    const blob = await res.blob();
    // Store the binary data in indexedDB:
    console.log("storing blob")
    console.log(blob)
    await db.friends.put({
        name: id,
        image: blob
    });
    console.log("done")
  },
  async isAvailableOffline(id) {
const count =  await db.friends.where("name").equals(id).count()
console.log(count)
return  count >= 1
  },
  async createSource(id){
      console.log(id)
      
      
      const avail = await this.isAvailableOffline(id)
      console.log(avail)
      if (avail){
        const entry = await db.friends.where("name").equals(id).first()
      var blobUrl = URL.createObjectURL(entry.image);
      this.currentTrack = blobUrl
      return
      }
      this.currentTrack= "media/"+id+".mp3"
  }
  },
  }
</script>
