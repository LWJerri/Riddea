<script lang="ts">
  import Logo from "../assets/LOGO.png";
  import Navbar from "../components/navbar.svelte";
</script>

<div class="main">
  <Navbar />

  <div class="product">
    <img src={Logo} alt="BOT_LOGO" />
    <h1>RIDDEA</h1>
    <p>Telegram bot for view random anime images and uploads your custom images</p>
    <a href="https://t.me/riddea_bot" target="_blank">START!</a>
  </div>
</div>

<style>
  .main {
    -webkit-user-select: none;
    -webkit-user-drag: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: white;
    margin: 0rem 0rem 3.125rem 0rem;
  }

  h1 {
    font-size: 3.95rem;
    margin: 1.5rem 0rem 2.125rem 0rem;
    text-transform: uppercase;
  }

  p {
    font-size: 1.875rem;
    margin: 0rem 0.3125rem 7rem 0rem;
  }

  .product {
    padding-top: 0.9375rem;
    text-align: center;
  }

  .product a {
    background-color: #ed4245;
    color: white;
    text-transform: uppercase;
    font-size: 1.75rem;
    font-weight: bold;
    padding: 0.6375rem 4.125rem 0.6375rem 4.125rem;
    border-radius: 5.625rem;
  }

  .product a:hover {
    opacity: 0.7;
  }

  .product img {
    pointer-events: none;
    width: 16rem;
    height: 16rem;
  }
</style>
