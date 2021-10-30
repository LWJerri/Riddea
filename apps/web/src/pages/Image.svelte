<script lang="ts">
  import { onMount } from "svelte";
  import Navbar from "../components/navbar.svelte";
  import { api } from "../helpers/api";

  export let collID, imgID;

  let data = {
    collection: "",
    id: 0,
    uploadDate: "",
    link: "",
    imgID: 0,
  };

  onMount(async () => {
    const output = await (await api.get(`/v1/collections/${collID}/image/${imgID}`)).data;

    data.collection = output.collection.name;
    data.id = output.collection.id;
    data.uploadDate = output.createdAt;
    data.link = output.link;
    data.imgID = 0;
  });
</script>

<div class="image">
  <Navbar />

  <div class="info">
    <p>Collection: {data.collection} ({data.id})</p>
    <p>Image ID: {data.imgID}</p>
    <p>Uploaded:<br />{new Date(data.uploadDate).toLocaleString()}</p>

    <div class="button">
      <a href={data.link} target="_blank">Original</a>
    </div>

    <div class="preview">
      <img src={data.link} alt="PREVIEW" />
    </div>
  </div>
</div>

<style>
  .info {
    margin-top: 0.938rem;
    margin-bottom: 0.938rem;
    text-align: center;
  }

  .info p {
    margin: 0.313rem 0rem 0.313rem 0rem;
    font-size: 1.563rem;
    color: white;
  }

  .info a {
    color: white;
    background-color: #5663f7;
    font-size: 1.75rem;
    font-weight: bold;
    border-radius: 5.625rem;
    padding: 0.6375rem 4.125rem 0.6375rem 4.125rem;
  }

  .button {
    margin: 1.563rem 0rem 2.5rem 0rem;
  }

  .info a:hover {
    opacity: 0.7;
  }
</style>
