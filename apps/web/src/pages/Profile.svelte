<script lang="ts">
  import { onMount } from "svelte";
  import Navbar from "../components/navbar.svelte";
  import { api } from "../helpers/api";
  import type { CollectionDTO } from "../../../api/src/collections/dto/collection.dto";

  export let userID: number;
  let userCollections: CollectionDTO[] = [];

  async function collectionRequest() {
    try {
      const data = await api.get(`/v1/users/${userID}/collections`);
      return (userCollections = [...userCollections, ...data.data]);
    } catch (err) {
      console.error(`Profile data request error:`, err);
    }
  }

  onMount(() => {
    collectionRequest();
  });
</script>

<div class="profile-page">
  <Navbar />

  <h1 class="profile-section">Collections</h1>
  <div class="collections-box">
    {#if userCollections.length}
      {#each userCollections as collection}
        <a href="/collection/{collection.id}" target="_blank">
          <div class="coolection">
            <h1>{collection.name}</h1>
            <h2>Type</h2>
            <p>{collection.isPublic ? "Public" : "Private"}</p>
            <h2>Date of creation</h2>
            <p>{new Date(collection.createdAt).toLocaleString()}</p>
            <h2>Last update</h2>
            <p>{new Date(collection.updatedAt).toLocaleString()}</p>
          </div>
        </a>
      {/each}
    {:else}
      <p class="collection-error">Empty :(</p>
    {/if}
  </div>
</div>

<style>
  * {
    -webkit-user-select: none;
    -webkit-user-drag: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .collections-box {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-wrap: wrap;
    padding: 0.3125rem;
    text-align: center;
    justify-content: center;
  }

  .profile-section {
    color: white;
    text-align: center;
    font-size: 1.875rem;
  }

  .collection-error {
    font-size: 1.5625rem;
    color: white;
  }

  .coolection:hover {
    opacity: 0.7;
  }

  .coolection {
    background-color: #5865f2;
    width: fit-content;
    border-radius: 0.625rem;
    color: white;
    padding: 0.3125rem 0.3125rem 0.3125rem 0.3125rem;
    margin: 0.3125rem 0.3125rem 0.3125rem 0.3125rem;
  }

  .coolection h1 {
    color: #57f287;
    word-break: break-all;
    margin-bottom: 0.9375rem;
  }

  .coolection p {
    font-size: 1.1875rem;
  }
</style>
