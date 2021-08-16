<script lang="ts">
  import Logo from "../assets/LOGO.png";
  import Profile from "./profile.svelte";
</script>

<header>
  <img class="logo-img" src={Logo} alt="BOT_LOGO" />
  <h1 class="logo-text"><a href="/">RIDDEA</a></h1>
  <p><Profile /></p>
</header>

<style>
  header {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 0.125rem 0.9375rem 0.125rem 0.9375rem;
    background-color: #5865f2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
  }

  header a{
    text-decoration: none;
    color: white;
  }

  header h1 {
    margin-left: 0.3125rem;
    font-size: 1.875rem;
    flex: 1;
  }

  header img {
    pointer-events: none;
    height: 3.4375rem;
    width: 3.4375rem;
  }

  @media screen and (max-width: 26.5rem) {
    .logo-text {
      display: none;
    }
  }
</style>
