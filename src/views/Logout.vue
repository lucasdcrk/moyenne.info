<script>
    export default {
        mounted() {
            localStorage.clear();
            window.bus.$emit('logged-out');
            this.refreshingSession = false;
            this.$router.push('/login');
        }
    }
</script>
