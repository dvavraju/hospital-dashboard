<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Chip from 'primevue/chip';
import Skeleton from 'primevue/skeleton';

const loading = ref(true);

const inflowData = ref(null);
const inflowOptions = ref(null);
const referralData = ref(null);
const referralOptions = ref(null);
const readmissionData = ref(null);
const readmissionOptions = ref(null);

const branchData = ref([
    { name: 'Hyderabad Main', opd: 245, ipd: 18, revenue: '₹1.8 Cr', waitTime: '14 min', satisfaction: 4.3, status: 'On Target' },
    { name: 'Secunderabad', opd: 142, ipd: 12, revenue: '₹1.1 Cr', waitTime: '18 min', satisfaction: 3.9, status: 'At Risk' },
    { name: 'Vijayawada', opd: 98, ipd: 8, revenue: '₹72 L', waitTime: '22 min', satisfaction: 3.6, status: 'Below' },
    { name: 'Warangal', opd: 68, ipd: 5, revenue: '₹42 L', waitTime: '12 min', satisfaction: 4.5, status: 'On Target' },
]);

const getStatusSeverity = (status) => {
    switch (status) {
        case 'On Target': return 'success';
        case 'At Risk': return 'warn';
        case 'Below': return 'danger';
        default: return null;
    }
};

const setupCharts = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-primary') || '#F9FAFB';
    const textColorSecondary = documentStyle.getPropertyValue('--text-muted') || '#6B7280';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#1E2A3B';
    const cardBg = documentStyle.getPropertyValue('--card-bg') || '#0B0F1A';

    // Patient Inflow Trend (Area chart - last 30 days)
    const labels30 = Array.from({ length: 30 }, (_, i) => `Apr ${i + 1}`);
    inflowData.value = {
        labels: labels30,
        datasets: [
            {
                label: 'OPD',
                data: [280, 310, 295, 320, 340, 305, 180, 290, 315, 330, 345, 310, 295, 170, 300, 325, 340, 350, 320, 285, 175, 305, 330, 345, 360, 335, 310, 190, 310, 342],
                fill: true,
                backgroundColor: 'rgba(0, 194, 255, 0.15)',
                borderColor: '#00C2FF',
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'IPD',
                data: [25, 28, 30, 32, 27, 29, 20, 26, 31, 33, 28, 30, 27, 18, 29, 32, 34, 30, 28, 25, 19, 27, 31, 33, 35, 29, 28, 21, 28, 28],
                fill: true,
                backgroundColor: 'rgba(124, 58, 237, 0.15)',
                borderColor: '#7C3AED',
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'Emergency',
                data: [40, 45, 38, 42, 50, 48, 55, 43, 47, 44, 52, 46, 39, 58, 41, 44, 48, 51, 45, 42, 56, 44, 46, 49, 53, 47, 41, 54, 43, 48],
                fill: true,
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                borderColor: '#EF4444',
                tension: 0.4,
                pointRadius: 0
            }
        ]
    };

    inflowOptions.value = {
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: textColor, usePointStyle: true, pointStyle: 'circle' } }
        },
        scales: {
            x: { ticks: { color: textColorSecondary, maxTicksLimit: 10 }, grid: { color: surfaceBorder } },
            y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } }
        }
    };

    // Referral Sources Donut
    referralData.value = {
        labels: ['Walk-in', 'Doctor Referral', 'Insurance Panel', 'App Booking', 'Corporate Tie-up'],
        datasets: [{
            data: [35, 25, 18, 12, 10],
            backgroundColor: ['#00C2FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'],
            hoverBackgroundColor: ['#00aae6', '#6b2ed1', '#0e9d6d', '#e09003', '#dc3838'],
            borderColor: cardBg,
            borderWidth: 2
        }]
    };

    referralOptions.value = {
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: { position: 'right', labels: { color: textColor, usePointStyle: true, pointStyle: 'circle', padding: 12 } }
        }
    };

    // Readmission Trend
    readmissionData.value = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: 'Readmission Rate %',
                data: [5.8, 6.0, 5.5, 6.4, 6.1, 6.2],
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Benchmark',
                data: [5, 5, 5, 5, 5, 5],
                borderColor: '#6B7280',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }
        ]
    };

    readmissionOptions.value = {
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { labels: { color: textColor, usePointStyle: true } }
        },
        scales: {
            x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
            y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder }, min: 0, max: 10 }
        }
    };
};

onMounted(() => {
    // Small delay to ensure styles are attached
    setTimeout(() => {
        setupCharts();
        loading.value = false;
    }, 200);
});
</script>

<template>
  <div class="animate-card" style="display: flex; flex-direction: column; gap: 1.5rem;">
    <!-- ROW 1 — KPI Cards -->
    <div class="grid-container grid-cols-5">
        <Card class="glass-card accent-border-emerald">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">Daily Inflow</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;">412</div>
                    <span class="text-success" style="font-size: 0.8rem;"><i class="pi pi-arrow-up"></i> 7-day trend ↑</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-emerald">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">Admissions</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;">28</div>
                    <span class="text-muted" style="font-size: 0.8rem;">vs 7d avg: 31</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-emerald">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">Discharges</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;">31</div>
                    <span class="text-warning" style="font-size: 0.8rem;">Pending: 6</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">No-show Rate</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0; color: var(--warning);">8.4%</div>
                    <span class="text-warning" style="font-size: 0.8rem;">⚠ Bench: &lt;5%</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">30-day Readmission</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0; color: var(--warning);">6.2%</div>
                    <span class="text-warning" style="font-size: 0.8rem;">⚠ Target: &lt;5%</span>
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 2 — Flow Charts -->
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <Card class="glass-card" style="flex: 1 1 58%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Patient Inflow Trend (30 Days)</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
                <div v-else style="height: 300px; width: 100%;">
                    <Chart type="line" :data="inflowData" :options="inflowOptions" style="height: 100%; width: 100%;" />
                </div>
            </template>
        </Card>
        <Card class="glass-card" style="flex: 1 1 38%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Referral Sources</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
                <div v-else style="height: 300px; width: 100%; display: flex; align-items: center; justify-content: center;">
                    <Chart type="doughnut" :data="referralData" :options="referralOptions" style="height: 100%; width: 100%;" />
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 3 — Branch Performance Table + Readmission Trend -->
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <Card class="glass-card" style="flex: 1 1 60%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Center / Branch Performance</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="250px" /></div>
                <DataTable v-else :value="branchData" responsiveLayout="scroll" class="p-datatable-sm">
                    <Column field="name" header="Branch"></Column>
                    <Column field="opd" header="OPD" class="mono-data"></Column>
                    <Column field="ipd" header="IPD" class="mono-data"></Column>
                    <Column field="revenue" header="Revenue" class="mono-data"></Column>
                    <Column field="waitTime" header="Avg Wait" class="mono-data"></Column>
                    <Column field="satisfaction" header="Satisfaction">
                        <template #body="slotProps">
                            <span class="mono-data" :style="{ color: slotProps.data.satisfaction >= 4 ? 'var(--success)' : 'var(--warning)' }">
                                {{ slotProps.data.satisfaction }}/5
                            </span>
                        </template>
                    </Column>
                    <Column header="Status">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" style="font-size: 0.75rem;" />
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
        <Card class="glass-card" style="flex: 1 1 35%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Readmission Trend</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="250px" /></div>
                <div v-else style="height: 250px; width: 100%;">
                    <Chart type="line" :data="readmissionData" :options="readmissionOptions" style="height: 100%; width: 100%;" />
                </div>
            </template>
        </Card>
    </div>
  </div>
</template>

<style scoped>
.grid-cols-5 {
    grid-template-columns: repeat(5, 1fr);
}
@media (max-width: 1200px) {
    .grid-cols-5 { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
    .grid-cols-5 { grid-template-columns: 1fr; }
}
</style>
