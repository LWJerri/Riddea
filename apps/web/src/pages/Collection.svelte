<script lang="ts">
  import { onMount } from "svelte";
  import { api } from "../helpers/api";
  import Navbar from "../components/navbar.svelte";
  import type { UploadsDTO } from "../../../api/src/collections/dto/upload.dto";

  const pageURL = parseInt(new URLSearchParams(window.location.search).get("page"));

  export let id: number;
  let page = pageURL;
  let next = true;
  let isPublic = true;
  let images: UploadsDTO[] = [];

  async function fetchData() {
    try {
      const imagesRes = await api.get(`/v1/collections/${id}/images?page=${page}&limit=100`);

      next = imagesRes.data.nextPage;
      images = [...images, ...imagesRes.data.data];
    } catch (err) {
      if (err.response.status != 200) isPublic = false;
    }
  }

  if (!pageURL || page < 1 || isNaN(page)) {
    document.location.href = `/collection/${id}?page=1`;
  }

  onMount(() => {
    fetchData();
  });
</script>

<div class="collection">
  <Navbar />

  {#if isPublic}
    {#if !images.length}
      <div class="collection-error">
        <h1>Woops!</h1>
        <p>This collection don't have pictures!</p>
      </div>
    {/if}

    <div class="collection-photo-box">
      {#each images as image}
        <a href={"https://" + image.fileUrl} target="_blank">
          <img class="collection-photo" src={"https://" + image.fileUrl} alt="COLLECTION_PHOTO" />
        </a>
      {/each}
    </div>

    <div class="pagination">
      {#if page > 1 && images.length}
        <a href="/collection/{id}?page={page - 1}">BACK</a>
      {/if}

      {#if next && images.length}
        <a href="/collection/{id}?page={page + 1}">NEXT</a>
      {/if}
    </div>
  {:else}
    <div class="collection-error">
      <h1>Woops!</h1>
      <p>Can't fetch collection pictures, because this collection is private!</p>
    </div>
  {/if}
</div>

<style>
  .pagination {
    text-align: center;
    margin: 0.625rem 0.9375rem 0.9375rem 1.5625rem;
  }

  .pagination a {
    color: white;
    background-color: #5865f2;
    padding: 0.1875rem 1.5625rem 0.1875rem 1.5625rem;
    margin: 0.3125rem;
    font-size: 1.25rem;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 5.625rem;
  }

  .pagination a:hover {
    opacity: 0.7;
  }

  .collection-error {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .collection-error h1 {
    color: #ed4245;
    font-size: 3.4375rem;
    text-transform: uppercase;
  }

  .collection-error p {
    color: white;
    font-size: 1.5rem;
  }

  .collection-photo-box {
    margin-left: auto;
    margin-right: auto;
    width: 66.5rem;
    display: flex;
    flex-wrap: wrap;
    padding: 0.3125rem;
    justify-content: center;
  }

  .collection-photo-box a {
    background-color: Transparent;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
    overflow: hidden;
  }

  .collection-photo {
    margin: 0.3125rem;
    width: 16rem;
    height: 16rem;
    image-rendering: optimizeSpeed;
  }

  .collection-photo:hover {
    opacity: 0.7;
  }

  @media screen and (max-width: 68.0625rem) {
    .collection-photo-box {
      width: 53.125rem;
    }

    .collection-photo {
      margin: 0.3125 rem;
      width: 12.625rem;
      height: 12.625rem;
    }
  }

  @media screen and (max-width: 54.3125rem) {
    .collection-photo-box {
      width: 40.625rem;
    }

    .collection-photo {
      margin: 0.3125rem;
      width: 12.5rem;
      height: 12.5rem;
    }
  }

  @media screen and (max-width: 42.0625rem) {
    .collection-photo-box {
      width: 25.625rem;
    }

    .collection-photo {
      margin: 0.3125rem;
      width: 7.5rem;
      height: 7.5rem;
    }
  }

  @media screen and (max-width: 26.5rem) {
    .collection-photo-box {
      width: 21.875rem;
    }

    .collection-photo {
      margin: 0.3125rem;
      width: 6.25rem;
      height: 6.25rem;
    }
  }

  @media screen and (max-width: 23.25rem) {
    .collection-photo-box {
      width: 18.75rem;
    }

    .collection-photo {
      margin: 0.3125rem;
      width: 5.625rem;
      height: 5.625rem;
    }
  }

  @media screen and (max-width: 19.9375rem) {
    .collection-photo-box {
      display: none;
    }
  }
</style>
