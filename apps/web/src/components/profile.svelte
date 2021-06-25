<script lang="ts">
  import { statsStore } from "../stores/stats";
  import { userStore } from "../stores/user";

  const authUrl = `${window.location.origin}/api/v1/auth/telegram/callback`;
</script>

{#if !authUrl.includes("localhost") && $statsStore.botInfo?.username && !$userStore.id}
  <script
    async
    src="https://telegram.org/js/telegram-widget.js?15"
    data-telegram-login={$statsStore.botInfo?.username}
    data-size="large"
    data-userpic="false"
    data-auth-url={authUrl}
    data-request-access="write"></script>
{:else if !$statsStore.botInfo?.username}
<!-- Connection to bot is not exists, so we just skiping login button-->
{:else}
  <a href="/user/{$userStore.id}"><img class="user-btn" src={$userStore.photo_url} alt="USER_LOGO" /></a>
{/if}

<style>
  .user-btn {
    border-radius: 50%;
    height: 3.4375rem;
    width: 3.4375rem;
  }
</style>
