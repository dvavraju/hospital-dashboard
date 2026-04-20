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

const trendData = ref(null);
const trendOptions = ref(null);

// Incident Heatmap data - 90 days
const heatmapData = ref([]);
const generateHeatmap = () => {
    const data = [];
    for (let week = 0; week < 13; week++) {
        const weekData = [];
        for (let day = 0; day < 7; day++) {
            weekData.push(Math.floor(Math.random() * 5));
        }
        data.push(weekData);
    }
    heatmapData.value = data;
};

const getHeatColor = (val) => {
    if (val === 0) return 'rgba(255,255,255,0.03)';
    if (val === 1) return 'rgba(0, 194, 255, 0.2)';
    if (val === 2) return 'rgba(0, 194, 255, 0.4)';
    if (val === 3) return 'rgba(245, 158, 11, 0.5)';
    return 'rgba(239, 68, 68, 0.6)';
};

const incidents = ref([
    { date: 'Apr 19', type: 'Medication Error', dept: 'ICU', severity: 'High', status: 'Under Review', assignedTo: 'Dr. Priya Nair', avatar: 'PN' },
    { date: 'Apr 18', type: 'Patient Fall', dept: 'Orthopedics', severity: 'Medium', status: 'Resolved', assignedTo: 'Dr. Arun Kumar', avatar: 'AK' },
    { date: 'Apr 18', type: 'HAI', dept: 'ICU', severity: 'Critical', status: 'Open', assignedTo: 'Dr. Raghavan', avatar: 'RG' },
    { date: 'Apr 17', type: 'Surgical Complication', dept: 'Cardiology', severity: 'High', status: 'Under Review', assignedTo: 'Dr. Mehta', avatar: 'VM' },
    { date: 'Apr 17', type: 'Medication Error', dept: 'Pediatrics', severity: 'Low', status: 'Resolved', assignedTo: 'Dr. Kavitha', avatar: 'KV' },
    { date: 'Apr 16', type: 'Patient Fall', dept: 'Neurology', severity: 'Medium', status: 'Resolved', assignedTo: 'Dr. Suresh Babu', avatar: 'SB' },
    { date: 'Apr 16', type: 'Equipment Failure', dept: 'Radiology', severity: 'High', status: 'Open', assignedTo: 'Dr. Rajesh', avatar: 'RJ' },
    { date: 'Apr 15', type: 'HAI', dept: 'Emergency', severity: 'Critical', status: 'Under Review', assignedTo: 'Dr. Meena', avatar: 'MN' },
    { date: 'Apr 14', type: 'Medication Error', dept: 'Oncology', severity: 'Low', status: 'Resolved', assignedTo: 'Dr. Srinivas', avatar: 'SR' },
    { date: 'Apr 13', type: 'Surgical Complication', dept: 'Neurology', severity: 'Medium', status: 'Resolved', assignedTo: 'Dr. Suresh Babu', avatar: 'SB' },
]);

const getSeveritySeverity = (sev) => {
    switch (sev) {
        case 'Low': return 'success';
        case 'Medium': return 'warn';
        case 'High': return 'danger';
        case 'Critical': return 'danger';
        default: return null;
    }
};

const getStatusSeverity = (status) => {
    switch (status) {
        case 'Resolved': return 'success';
        case 'Under Review': return 'warn';
        case 'Open': return 'danger';
        default: return null;
    }
};

const setupCharts = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-primary') || '#F9FAFB';
    const textColorSecondary = documentStyle.getPropertyValue('--text-muted') || '#6B7280';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#1E2A3B';

    trendData.value = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: 'HAI Rate %',
                data: [1.4, 1.3, 1.5, 1.1, 1.3, 1.2],
                borderColor: '#EF4444',
                tension: 0.4,
                pointRadius: 3
            },
            {
                label: 'Surgical Mortality %',
                data: [0.9, 1.0, 0.7, 0.8, 0.9, 0.8],
                borderColor: '#F59E0B',
                tension: 0.4,
                pointRadius: 3
            },
            {
                label: 'Complication Rate %',
                data: [2.3, 2.5, 2.0, 2.2, 2.1, 2.1],
                borderColor: '#7C3AED',
                tension: 0.4,
                pointRadius: 3
            },
            {
                label: 'Med Error Rate',
                data: [0.5, 0.4, 0.4, 0.3, 0.35, 0.3],
                borderColor: '#00C2FF',
                tension: 0.4,
                pointRadius: 3
            },
            {
                label: 'Fall Rate',
                data: [1.1, 1.2, 1.0, 0.9, 1.0, 0.9],
                borderColor: '#10B981',
                tension: 0.4,
                pointRadius: 3
            },
            {
                label: 'Readmission %',
                data: [5.8, 6.0, 5.5, 6.4, 6.1, 6.2],
                borderColor: '#EC4899',
                tension: 0.4,
                pointRadius: 3
            },
            {
                label: 'Benchmark',
                data: [1, 1, 1, 1, 1, 1],
                borderColor: '#6B7280',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }
        ]
    };

    trendOptions.value = {
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: textColor, usePointStyle: true, pointStyle: 'circle', padding: 10, font: { size: 10 } } }
        },
        scales: {
            x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
            y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder }, min: 0 }
        }
    };
};

onMounted(() => {
    generateHeatmap();
    setTimeout(() => {
        setupCharts();
        loading.value = false;
    }, 200);
});
</script>

<template>
  <div class="animate-card" style="display: flex; flex-direction: column; gap: 1.5rem;">
    <!-- ROW 1 — KPI Cards -->
    <div class="grid-container grid-cols-6">
        <Card class="glass-card accent-border-red">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">HAI Rate</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0; color: var(--danger);">1.2%</div>
                    <span class="text-danger" style="font-size: 0.75rem;">🔴 Bench: &lt;1%</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-emerald">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">Surgical Mortality</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0;">0.8%</div>
                    <span class="text-success" style="font-size: 0.75rem;">✅ Bench: &lt;1%</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">Complication Rate</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0; color: var(--warning);">2.1%</div>
                    <span class="text-warning" style="font-size: 0.75rem;">⚠ Target: &lt;2%</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-emerald">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">Med Error Rate</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0;">0.3</div>
                    <span class="text-success" style="font-size: 0.75rem;">✅ <i class="pi pi-arrow-down"></i> per 100 pts</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-emerald">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">Fall Rate</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0;">0.9</div>
                    <span class="text-success" style="font-size: 0.75rem;">✅ per 1000 bed-days</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">30-day Readmission</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.25rem 0; color: var(--warning);">6.2%</div>
                    <span class="text-warning" style="font-size: 0.75rem;">⚠ Target: &lt;5%</span>
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 2 — Quality Trends + Incident Heatmap -->
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <Card class="glass-card" style="flex: 1 1 70%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Quality Indicators Trend</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="320px" /></div>
                <div v-else style="height: 320px; width: 100%;">
                    <Chart type="line" :data="trendData" :options="trendOptions" style="height: 100%; width: 100%;" />
                </div>
            </template>
        </Card>
        <Card class="glass-card" style="flex: 1 1 25%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Incident Heatmap (90 Days)</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="320px" /></div>
                <div v-else>
                    <div style="display: flex; gap: 4px; margin-bottom: 8px;">
                        <span class="text-muted" style="font-size: 0.7rem; width: 30px;"></span>
                        <span v-for="d in ['M','T','W','T','F','S','S']" :key="d" class="text-muted" style="flex: 1; text-align: center; font-size: 0.65rem;">{{ d }}</span>
                    </div>
                    <div class="heatmap-grid">
                        <div v-for="(week, wi) in heatmapData" :key="wi" class="heatmap-row">
                            <span class="text-muted" style="font-size: 0.6rem; width: 30px; flex-shrink: 0;">W{{ wi + 1 }}</span>
                            <div 
                                v-for="(val, di) in week" 
                                :key="di"
                                class="heatmap-cell"
                                :style="{ background: getHeatColor(val) }"
                                :title="val + ' incidents'"
                            ></div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 12px; justify-content: flex-end;">
                        <span class="text-muted" style="font-size: 0.7rem;">Less</span>
                        <div class="heatmap-cell" :style="{ background: getHeatColor(0), width: '12px', height: '12px' }"></div>
                        <div class="heatmap-cell" :style="{ background: getHeatColor(1), width: '12px', height: '12px' }"></div>
                        <div class="heatmap-cell" :style="{ background: getHeatColor(2), width: '12px', height: '12px' }"></div>
                        <div class="heatmap-cell" :style="{ background: getHeatColor(3), width: '12px', height: '12px' }"></div>
                        <div class="heatmap-cell" :style="{ background: getHeatColor(4), width: '12px', height: '12px' }"></div>
                        <span class="text-muted" style="font-size: 0.7rem;">More</span>
                    </div>
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 3 — Incident Log Table -->
    <Card class="glass-card">
        <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Clinical Incident Log</span></template>
        <template #content>
            <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
            <DataTable v-else :value="incidents" paginator :rows="5" responsiveLayout="scroll" class="p-datatable-sm">
                <Column field="date" header="Date"></Column>
                <Column field="type" header="Type"></Column>
                <Column field="dept" header="Department"></Column>
                <Column header="Severity">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.severity" :severity="getSeveritySeverity(slotProps.data.severity)" style="font-size: 0.75rem;" />
                    </template>
                </Column>
                <Column header="Status">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" style="font-size: 0.75rem;" />
                    </template>
                </Column>
                <Column header="Assigned To">
                    <template #body="slotProps">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <Avatar :label="slotProps.data.avatar" size="small" shape="circle" style="background: var(--surface-border); color: var(--text-primary); font-size: 0.65rem;" />
                            <span style="font-size: 0.85rem;">{{ slotProps.data.assignedTo }}</span>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>
  </div>
</template>

<style scoped>
.heatmap-grid {
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.heatmap-row {
    display: flex;
    gap: 3px;
    align-items: center;
}
.heatmap-cell {
    flex: 1;
    aspect-ratio: 1;
    border-radius: 2px;
    min-width: 0;
    transition: transform 0.15s;
}
.heatmap-cell:hover {
    transform: scale(1.3);
    z-index: 2;
}
</style>
