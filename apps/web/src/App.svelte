<script lang="ts">
  import { onMount } from "svelte";
  import { Route, Router } from "svelte-navigator";
  import Collection from "./pages/Collection.svelte";
  import UserPage from "./pages/Profile.svelte";
  import Main from "./pages/Main.svelte";
  import { fetchAndSetData as statsFetchAndSetData } from "./stores/stats";
  import { fetchAndSetData as userFetchAndSetData } from "./stores/user";

  onMount(async () => {
    await Promise.all([statsFetchAndSetData(), userFetchAndSetData()]);
  });
</script>

<Router>
  <main>
    <Route path="collection/:id" component={Collection} />
    <Route path="user/:userID" component={UserPage} />
    <Route component={Main} />
  </main>
</Router>

<style>
  :root {
    font-family: "Noto Sans KR", sans-serif;
    background-color: #23272a;
  }
</style>
