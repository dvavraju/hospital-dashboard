<script setup>
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
import { useToast } from "primevue/usetoast";
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Sidebar from 'primevue/sidebar';
import Toast from 'primevue/toast';

import FinancialHealth from './components/FinancialHealth.vue';
import Operations from './components/Operations.vue';
import PatientFlow from './components/PatientFlow.vue';
import ClinicalQuality from './components/ClinicalQuality.vue';
import Compliance from './components/Compliance.vue';
import People from './components/People.vue';

const toast = useToast();

const branches = ref([
    { name: 'All Branches', code: 'ALL' },
    { name: 'Hyderabad Main', code: 'HYD' },
    { name: 'Secunderabad', code: 'SEC' },
    { name: 'Vijayawada', code: 'VIJ' }
]);
const selectedBranch = ref(branches.value[0]);
const showNotifications = ref(false);
const currentTime = ref('');
let timeInterval = null;

// Theme toggle
const isDark = ref(true);
const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (isDark.value) {
        document.documentElement.classList.add('app-dark');
    } else {
        document.documentElement.classList.remove('app-dark');
    }
};

const navItems = [
    { id: 'financial', label: 'Financial Health', icon: 'pi pi-wallet', component: FinancialHealth },
    { id: 'operations', label: 'Operations', icon: 'pi pi-cog', component: Operations },
    { id: 'patient', label: 'Patient Flow', icon: 'pi pi-users', component: PatientFlow },
    { id: 'clinical', label: 'Clinical Quality', icon: 'pi pi-heart-fill', component: ClinicalQuality },
    { id: 'compliance', label: 'Compliance', icon: 'pi pi-file-check', component: Compliance },
    { id: 'people', label: 'People', icon: 'pi pi-id-card', component: People }
];

const activeViewId = ref('financial');
const activeComponent = shallowRef(FinancialHealth);
const isSidebarCollapsed = ref(false);

const changeView = (item) => {
    activeViewId.value = item.id;
    activeComponent.value = item.component;
};

const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
};

const notifications = ref([
    { severity: 'danger', title: 'Critical Alert', text: 'Claim denial rate exceeded 4% threshold for current month.', time: '2 mins ago' },
    { severity: 'warning', title: 'Warning', text: 'ICU bed availability below 20% in Hyderabad Main branch.', time: '15 mins ago' },
    { severity: 'warning', title: 'Compliance', text: 'NABH criterion B3.2 non-compliant — action pending.', time: '1 hr ago' },
    { severity: 'info', title: 'Info', text: '3 new patient feedback received for Cardiology OPD.', time: '2 hrs ago' },
    { severity: 'danger', title: 'Critical', text: 'Medico-legal case #ML-2024-07 requires response by 25 Apr.', time: '3 hrs ago' },
]);

const getNotifColor = (sev) => {
    switch(sev) {
        case 'danger': return 'var(--danger)';
        case 'warning': return 'var(--warning)';
        case 'info': return 'var(--accent-primary)';
        default: return 'var(--text-muted)';
    }
};

const getNotifBg = (sev) => {
    switch(sev) {
        case 'danger': return 'rgba(239, 68, 68, 0.08)';
        case 'warning': return 'rgba(245, 158, 11, 0.08)';
        case 'info': return 'rgba(0, 194, 255, 0.08)';
        default: return 'var(--hover-bg)';
    }
};

onMounted(() => {
    updateTime();
    timeInterval = setInterval(updateTime, 1000);

    setTimeout(() => {
        toast.add({ severity: 'error', summary: 'Critical Alert', detail: 'Claim denial rate exceeded 4% threshold', life: 6000 });
    }, 2000);
    setTimeout(() => {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'ICU bed availability below 20%', life: 6000 });
    }, 3500);
});

onUnmounted(() => {
    if (timeInterval) clearInterval(timeInterval);
});
</script>

<template>
  <div class="app-container p-component">
    <Toast />
    
    <!-- LEFT SIDEBAR -->
    <div :class="['sidebar', { 'collapsed': isSidebarCollapsed }]">
        <div style="padding: 1.25rem 1rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--surface-border);">
            <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;" v-if="!isSidebarCollapsed">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i class="pi pi-building" style="font-size: 1rem; color: white;"></i>
                </div>
                <div>
                    <h3 style="margin: 0; white-space: nowrap; font-size: 0.95rem; color: var(--text-primary);">Apollo MS</h3>
                    <span style="font-size: 0.65rem; color: var(--text-muted);">Hospital Group</span>
                </div>
            </div>
            <div v-else style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                <i class="pi pi-building" style="font-size: 1rem; color: white;"></i>
            </div>
            
            <i v-if="!isSidebarCollapsed" class="pi pi-bars text-muted" style="cursor: pointer; font-size: 1.1rem; transition: color 0.2s;" @click="isSidebarCollapsed = !isSidebarCollapsed"></i>
        </div>
        
        <div style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 4px; flex: 1;">
            <div 
                v-for="item in navItems" 
                :key="item.id"
                :class="['sidebar-nav-item', { 'active': activeViewId === item.id }]"
                @click="changeView(item)"
                :title="item.label"
            >
                <i :class="item.icon" style="font-size: 1.1rem; min-width: 22px; text-align: center;"></i>
                <span v-if="!isSidebarCollapsed" style="font-weight: 500; font-size: 0.9rem; white-space: nowrap;">{{ item.label }}</span>
            </div>
        </div>

        <!-- Collapse toggle at bottom -->
        <div v-if="isSidebarCollapsed" style="padding: 1rem; border-top: 1px solid var(--surface-border); text-align: center;">
            <i class="pi pi-angle-double-right text-muted" style="cursor: pointer; font-size: 1.1rem; transition: color 0.2s;" @click="isSidebarCollapsed = false"></i>
        </div>
    </div>
    
    <!-- MAIN CONTENT -->
    <div class="main-content">
        <!-- TOPBAR -->
        <div class="topbar">
            <div>
                <h2 style="margin:0; font-size: 1.2rem; font-weight: 700; letter-spacing: -0.3px;">Executive Dashboard</h2>
                <div class="mono-data text-muted" style="font-size: 0.78rem; margin-top: 3px;">{{ currentTime }}</div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 1.25rem;">
                <Dropdown v-model="selectedBranch" :options="branches" optionLabel="name" placeholder="Select a Branch" class="w-full md:w-14rem" />
                
                <!-- THEME TOGGLE -->
                <div class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                    <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
                </div>

                <div style="position: relative; cursor: pointer; padding: 6px;" @click="showNotifications = true">
                    <i class="pi pi-bell" style="font-size: 1.2rem; color: var(--text-muted); transition: color 0.2s;"></i>
                    <span style="position: absolute; top: 0; right: 0; width: 18px; height: 18px; background: var(--danger); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 700; color: white; border: 2px solid var(--bg-color);">3</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 10px; cursor: pointer; padding-left: 12px; border-left: 1px solid var(--surface-border);">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; color: white;">DC</div>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Dr. Chairman</span>
                        <span class="text-muted" style="font-size: 0.7rem;">Group Owner</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- GLOBAL STRIP -->
        <div class="global-summary-strip">
            <div class="strip-chip">
                <span class="strip-label">Total Revenue</span>
                <span class="mono-data strip-value">₹4.2Cr</span>
                <i class="pi pi-arrow-up" style="font-size: 0.65rem; color: var(--success);"></i>
            </div>
            <div class="strip-chip">
                <span class="strip-label">Bed Occupancy</span>
                <span class="mono-data strip-value">78%</span>
            </div>
            <div class="strip-chip">
                <span class="strip-label">OPD Today</span>
                <span class="mono-data strip-value">342</span>
            </div>
            <div class="strip-chip">
                <span class="strip-label">Denial Rate</span>
                <span class="mono-data strip-value" style="color: var(--warning);">4.2%</span>
                <i class="pi pi-exclamation-triangle" style="font-size: 0.65rem; color: var(--warning);"></i>
            </div>
            <div class="strip-chip">
                <span class="strip-label">Open Alerts</span>
                <span class="mono-data strip-value" style="color: var(--danger);">3</span>
                <i class="pi pi-circle-fill" style="font-size: 0.4rem; color: var(--danger);"></i>
            </div>
        </div>
        
        <!-- DYNAMIC VIEW -->
        <div class="view-content">
            <component :is="activeComponent" :key="activeViewId" />
        </div>
    </div>
    
    <!-- NOTIFICATIONS SIDEBAR -->
    <Sidebar v-model:visible="showNotifications" position="right" style="width: 380px;">
        <template #header>
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="pi pi-bell" style="font-size: 1.15rem; color: var(--accent-primary);"></i>
                <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-primary);">Alerts & Notifications</h3>
            </div>
        </template>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.75rem;">
            <div 
                v-for="(notif, i) in notifications" 
                :key="i"
                :style="{ 
                    background: getNotifBg(notif.severity), 
                    borderLeft: '3px solid ' + getNotifColor(notif.severity), 
                    padding: '0.9rem 1rem', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }"
            >
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span :style="{ color: getNotifColor(notif.severity), fontWeight: 600, fontSize: '0.8rem' }">{{ notif.title }}</span>
                    <span class="text-muted" style="font-size: 0.7rem;">{{ notif.time }}</span>
                </div>
                <div style="font-size: 0.88rem; line-height: 1.4; color: var(--text-primary);">{{ notif.text }}</div>
            </div>
        </div>
    </Sidebar>
  </div>
</template>
