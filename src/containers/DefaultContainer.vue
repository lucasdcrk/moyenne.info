<template>
    <div class="app ld-over" :class="{ running: refreshingSession }">
        <div class="ld ld-loader" style="font-size: 8rem; background-image: url(https://svgur.com/i/9oS.svg)"></div>
        <AppHeader fixed>
            <SidebarToggler class="d-lg-none" display="md" mobile/>
            <b-link class="navbar-brand" to="#">
                <img class="navbar-brand-full" src="../assets/logo.png" width="140px" alt="">
                <img class="navbar-brand-minimized" src="../assets/logo-mini.png" width="40px" alt="">
            </b-link>
            <SidebarToggler class="d-md-down-none" display="lg"/>
            <b-navbar-nav class="d-md-down-none">
                <b-nav-item class="px-3" href="https://github.com/lucasdcrk/moyenne.info" target="_blank">Code Source</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="d-md-down-none">
                <b-nav-item class="px-3" to="/debug">Debug</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item class="px-3" @click="logout()">Déconnexion</b-nav-item>
            </b-navbar-nav>
        </AppHeader>
        <div class="app-body">
            <AppSidebar fixed>
                <SidebarHeader/>
                <SidebarForm/>
                <SidebarNav :navItems="nav"></SidebarNav>
                <SidebarFooter/>
                <SidebarMinimizer/>
            </AppSidebar>
            <main class="main ld-over" :class="{ running: $wait.any }">
                <div class="ld ld-ring ld-spin" style="font-size: 2rem;"/>
                <Breadcrumb :list="list"/>
                <div class="container-fluid">
                    <router-view></router-view>
                </div>
            </main>
        </div>
        <TheFooter>
            <!--footer-->
            <div>
                <span>&copy; 2017-2019</span>
                <a class="ml-1" href="https://github.com/lucasdcrk/moyenne.info">Moyenne.info</a>
                <span class="ml-1">v{{version}}</span>
            </div>
            <div class="ml-auto">
                <span class="mr-1">Développé par</span>
                <a href="https://lucas.decrock.me" target="_blank">Lucas Decrock</a>
            </div>
        </TheFooter>
    </div>
</template>

<script>
    import {
        Header as AppHeader,
        SidebarToggler,
        Sidebar as AppSidebar,
        SidebarFooter,
        SidebarForm,
        SidebarHeader,
        SidebarMinimizer,
        SidebarNav,
        Footer as TheFooter,
        Breadcrumb
    } from '@coreui/vue'

    export default {
        name: 'DefaultContainer',
        components: {
            AppHeader,
            AppSidebar,
            TheFooter,
            Breadcrumb,
            SidebarForm,
            SidebarFooter,
            SidebarToggler,
            SidebarHeader,
            SidebarNav,
            SidebarMinimizer
        },
        data() {
            return {
                refreshingSession: false,
                nav: [
                    {
                        name: 'Accueil',
                        url: '/',
                        icon: 'icon-home'
                    },
                    {
                        title: true,
                        name: 'Résultats',
                        class: '',
                        wrapper: {
                            element: '',
                            attributes: {}
                        }
                    },
                    {
                        name: 'Moyennes',
                        url: '/moyennes',
                        icon: 'icon-badge'
                    },
                    {
                        name: 'Relevé de notes',
                        url: '/notes',
                        icon: 'icon-list'
                    },
                    {
                        title: true,
                        name: 'Graphiques',
                        class: '',
                        wrapper: {
                            element: '',
                            attributes: {}
                        }
                    },
                    {
                        name: 'Evolution',
                        url: '/evolution',
                        icon: 'icon-chart'
                    },
                    {
                        name: 'Graphique',
                        url: '/graphique',
                        icon: 'icon-pie-chart'
                    }
                ]
            }
        },
        methods: {
            logout() {
                localStorage.clear();
                window.bus.$emit('logged-out');
                this.$router.push('/login');
            }
        },
        mounted() {
            window.bus.$on('loggout', () => {
                this.logout();
            });
            
            if (this.logged) {
                let user = JSON.parse(localStorage.user);
                window.axios.post('E/' + user.id + '/emploidutemps.awp?verbe=get', 'data={"token": "' + localStorage.token + '"}')
                    .then((response) => {
                        if (response.data.code !== 200) {
                            localStorage.token = null;
                            localStorage.user = null;
                            window.bus.$emit('logged-out');
                            this.$router.push('/login');
                        }
                    })
                    .catch(() => {
                        this.$router.push('/');
                    });
            }
        },
        computed: {
            name() {
                return this.$route.name
            },
            list() {
                return this.$route.matched.filter((route) => route.name || route.meta.label)
            }
        }
    }
</script>
