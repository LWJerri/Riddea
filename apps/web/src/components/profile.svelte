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
  <!-- Connection to bot is not exists, so we just skiping login button -->
{:else}
  <div class="user-panel">
    <img class="user-btn" src={$userStore.photo_url} alt="USER_LOGO" />
    
    <div class="panel-content">
      <a href="/user/{$userStore.id}">Profile</a>
      <a href="/api/v1/auth/logout">Logout</a>
    </div>
  </div>
{/if}

<style>
  .user-btn {
    border-radius: 50%;
    height: 3.4375rem;
    width: 3.4375rem;
  }

  .user-panel {
    display: inline-block;
    position: relative;
  }

  .panel-content {
    display: none;
    position: absolute;
    width: 115%;
    overflow: auto;
    box-shadow: 0rem 0.625rem 0.625rem 0rem rgba(0,0,0,0.4);
  }

  .user-panel:hover .panel-content {
    display: block;
    z-index: 999;
  }

  .panel-content a {
    margin: 0.125rem 0rem 0rem 0rem;
    display: block;
    color: #FFFFFF;
    padding: 0.5rem 0.75rem 0.5rem 0.75rem;
    text-decoration: none;
  }

  .panel-content a:hover {
    margin: 0.125rem 0rem 0rem 0rem;
    color: #FFFFFF;
    background-color: #ED4245;
  }
</style>
