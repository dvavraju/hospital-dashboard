<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Avatar from 'primevue/avatar';
import Skeleton from 'primevue/skeleton';

const loading = ref(true);

const staffUtilData = ref(null);
const staffUtilOptions = ref(null);
const overtimeData = ref(null);
const overtimeOptions = ref(null);

const doctors = ref([
    { name: 'Dr. Raghavan', specialty: 'Cardiology', opd: 42, ipd: 8, revenue: '₹28.5L', rating: 4.8, attendance: 96, avatar: 'RG' },
    { name: 'Dr. Mehta', specialty: 'Cardiology', opd: 38, ipd: 6, revenue: '₹24.2L', rating: 4.6, attendance: 92, avatar: 'VM' },
    { name: 'Dr. Priya Nair', specialty: 'Neurology', opd: 35, ipd: 5, revenue: '₹21.8L', rating: 4.9, attendance: 98, avatar: 'PN' },
    { name: 'Dr. Arun Kumar', specialty: 'Orthopedics', opd: 40, ipd: 7, revenue: '₹26.1L', rating: 4.5, attendance: 88, avatar: 'AK' },
    { name: 'Dr. Kavitha', specialty: 'Pediatrics', opd: 45, ipd: 4, revenue: '₹18.5L', rating: 4.7, attendance: 94, avatar: 'KV' },
    { name: 'Dr. Suresh Babu', specialty: 'Neurology', opd: 32, ipd: 6, revenue: '₹22.4L', rating: 4.4, attendance: 90, avatar: 'SB' },
    { name: 'Dr. Rajesh', specialty: 'Radiology', opd: 50, ipd: 2, revenue: '₹15.8L', rating: 4.3, attendance: 95, avatar: 'RJ' },
    { name: 'Dr. Meena', specialty: 'Oncology', opd: 28, ipd: 9, revenue: '₹30.2L', rating: 4.8, attendance: 97, avatar: 'MN' },
    { name: 'Dr. Srinivas', specialty: 'Emergency', opd: 55, ipd: 3, revenue: '₹19.6L', rating: 4.2, attendance: 85, avatar: 'SR' },
    { name: 'Dr. Lakshmi', specialty: 'ICU', opd: 10, ipd: 12, revenue: '₹32.1L', rating: 4.6, attendance: 93, avatar: 'LK' },
]);

const getRevenueColor = (rev) => {
    const val = parseFloat(rev.replace('₹', '').replace('L', ''));
    if (val >= 25) return 'var(--success)';
    if (val >= 18) return 'var(--warning)';
    return 'var(--danger)';
};

const getAttendanceColor = (att) => {
    if (att >= 95) return 'var(--success)';
    if (att >= 90) return 'var(--warning)';
    return 'var(--danger)';
};

const setupCharts = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-primary') || '#F9FAFB';
    const textColorSecondary = documentStyle.getPropertyValue('--text-muted') || '#6B7280';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#1E2A3B';

    staffUtilData.value = {
        labels: ['ICU', 'Emergency', 'OPD', 'Cardiology', 'Orthopedics', 'Radiology', 'Pediatrics', 'Oncology'],
        datasets: [
            {
                label: 'Actual Staff',
                data: [18, 22, 15, 12, 10, 8, 9, 7],
                backgroundColor: '#00C2FF'
            },
            {
                label: 'Planned Staff',
                data: [20, 20, 16, 12, 12, 10, 10, 8],
                backgroundColor: 'rgba(0, 194, 255, 0.25)'
            }
        ]
    };

    staffUtilOptions.value = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: textColor, usePointStyle: true } }
        },
        scales: {
            x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
            y: { ticks: { color: textColorSecondary }, grid: { display: false } }
        }
    };

    overtimeData.value = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
            {
                type: 'bar',
                label: 'Overtime Hours',
                backgroundColor: '#7C3AED',
                data: [265, 290, 310, 285, 300, 312]
            },
            {
                type: 'line',
                label: 'Budget Ceiling',
                borderColor: '#EF4444',
                borderDash: [5, 5],
                data: [280, 280, 280, 280, 280, 280],
                pointRadius: 0,
                order: 1,
                fill: false
            }
        ]
    };

    overtimeOptions.value = {
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: textColor, usePointStyle: true } }
        },
        scales: {
            x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
            y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } }
        }
    };
};

onMounted(() => {
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
        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">ACTIVE DOCTORS</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0;" class="mono-data">34 <span style="font-size: 0.9rem; color: var(--text-muted);">/ 40</span></div>
                    <span class="text-warning" style="font-size: 0.75rem;">⚠ 6 absent today</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-emerald">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">NURSING UTILIZATION</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0;" class="mono-data">88%</div>
                    <span class="text-success" style="font-size: 0.75rem;">✅ Bench: 85%</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">STAFF OVERTIME</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0; color: var(--warning);" class="mono-data">312 <span style="font-size: 0.85rem; color: var(--text-muted);">hrs</span></div>
                    <span class="text-warning" style="font-size: 0.75rem;">⚠ Budget: 280 hrs</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-red">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">OPEN POSITIONS</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0; color: var(--danger);" class="mono-data">7</div>
                    <span class="text-muted" style="font-size: 0.75rem;">ICU, OT, Radiology</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-cyan">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">EMPLOYEE SATISFACTION</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0;" class="mono-data">74 <span style="font-size: 0.85rem; color: var(--text-muted);">/ 100</span></div>
                    <span class="text-muted" style="font-size: 0.75rem;">Monthly pulse</span>
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 2 — Doctor Productivity Table -->
    <Card class="glass-card">
        <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Doctor Productivity</span></template>
        <template #content>
            <div v-if="loading"><Skeleton width="100%" height="350px" /></div>
            <DataTable v-else :value="doctors" paginator :rows="5" sortField="revenue" :sortOrder="-1" responsiveLayout="scroll" class="p-datatable-sm">
                <Column header="Doctor">
                    <template #body="slotProps">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <Avatar :label="slotProps.data.avatar" size="small" shape="circle" 
                                style="background: var(--surface-border); color: var(--text-primary); font-size: 0.65rem; font-weight: 600;" />
                            <span style="font-weight: 500;">{{ slotProps.data.name }}</span>
                        </div>
                    </template>
                </Column>
                <Column field="specialty" header="Specialty"></Column>
                <Column field="opd" header="OPD" sortable class="mono-data"></Column>
                <Column field="ipd" header="IPD" sortable class="mono-data"></Column>
                <Column header="Revenue" sortable field="revenue">
                    <template #body="slotProps">
                        <span class="mono-data" :style="{ color: getRevenueColor(slotProps.data.revenue) }">
                            {{ slotProps.data.revenue }}
                        </span>
                    </template>
                </Column>
                <Column header="Rating">
                    <template #body="slotProps">
                        <span class="mono-data" style="color: var(--warning);">
                            ★ {{ slotProps.data.rating }}
                        </span>
                    </template>
                </Column>
                <Column header="Attendance">
                    <template #body="slotProps">
                        <span class="mono-data" :style="{ color: getAttendanceColor(slotProps.data.attendance) }">
                            {{ slotProps.data.attendance }}%
                        </span>
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>

    <!-- ROW 3 — Staff Utilization + Overtime Trend -->
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <Card class="glass-card" style="flex: 1 1 55%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Dept-Wise Staff Utilization</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
                <div v-else style="height: 300px; width: 100%;">
                    <Chart type="bar" :data="staffUtilData" :options="staffUtilOptions" style="height: 100%; width: 100%;" />
                </div>
            </template>
        </Card>
        <Card class="glass-card" style="flex: 1 1 40%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Monthly Overtime Trend</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
                <div v-else style="height: 300px; width: 100%;">
                    <Chart type="bar" :data="overtimeData" :options="overtimeOptions" style="height: 100%; width: 100%;" />
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
