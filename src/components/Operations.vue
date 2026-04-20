<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Knob from 'primevue/knob';
import ProgressBar from 'primevue/progressbar';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';

const loading = ref(true);
const bedOccupancy = ref(78);
const otUtilization = ref(72);

// Bed grid data
const beds = ref([]);
const generateBeds = () => {
    const types = ['available', 'occupied', 'icu', 'maintenance'];
    const weights = [34, 118, 12, 6];
    const total = weights.reduce((a, b) => a + b, 0);
    const arr = [];
    for (let i = 0; i < total; i++) {
        if (i < weights[1]) arr.push('occupied');
        else if (i < weights[1] + weights[0]) arr.push('available');
        else if (i < weights[1] + weights[0] + weights[2]) arr.push('icu');
        else arr.push('maintenance');
    }
    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    beds.value = arr;
};

// OT Schedule
const otSchedule = ref([
    { ot: 'OT 1', slots: [
        { time: '07:00', procedure: 'CABG Surgery', doctor: 'Dr. Raghavan', status: 'Completed' },
        { time: '10:00', procedure: 'Valve Replacement', doctor: 'Dr. Mehta', status: 'Completed' },
        { time: '13:00', procedure: 'Angioplasty', doctor: 'Dr. Priya Nair', status: 'Ongoing' },
        { time: '16:00', procedure: 'Pace Maker', doctor: 'Dr. Srinivas', status: 'Upcoming' },
    ]},
    { ot: 'OT 2', slots: [
        { time: '08:00', procedure: 'Knee Replacement', doctor: 'Dr. Arun Kumar', status: 'Completed' },
        { time: '11:00', procedure: 'Hip Surgery', doctor: 'Dr. Kavitha', status: 'Ongoing' },
        { time: '14:00', procedure: 'Spine Fusion', doctor: 'Dr. Rajesh', status: 'Upcoming' },
        { time: '17:00', procedure: 'ACL Repair', doctor: 'Dr. Arun Kumar', status: 'Cancelled' },
    ]},
    { ot: 'OT 3', slots: [
        { time: '07:30', procedure: 'Craniotomy', doctor: 'Dr. Suresh Babu', status: 'Completed' },
        { time: '11:30', procedure: 'Tumor Removal', doctor: 'Dr. Meena', status: 'Completed' },
        { time: '15:00', procedure: 'Shunt Placement', doctor: 'Dr. Suresh Babu', status: 'Upcoming' },
    ]},
]);

const getSlotColor = (status) => {
    switch(status) {
        case 'Completed': return '#10B981';
        case 'Ongoing': return '#00C2FF';
        case 'Upcoming': return '#F59E0B';
        case 'Cancelled': return '#EF4444';
        default: return '#6B7280';
    }
};

const getSlotSeverity = (status) => {
    switch(status) {
        case 'Completed': return 'success';
        case 'Ongoing': return 'info';
        case 'Upcoming': return 'warn';
        case 'Cancelled': return 'danger';
        default: return null;
    }
};

// Charts
const dischargeData = ref(null);
const dischargeOptions = ref(null);
const equipmentData = ref(null);
const equipmentOptions = ref(null);

const setupCharts = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-primary') || '#F9FAFB';
    const textColorSecondary = documentStyle.getPropertyValue('--text-muted') || '#6B7280';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#1E2A3B';

    dischargeData.value = {
        labels: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Emergency', 'Pediatrics'],
        datasets: [
            {
                label: 'Discharge Time (min)',
                backgroundColor: '#00C2FF',
                data: [105, 82, 120, 95, 68, 78]
            }
        ]
    };

    dischargeOptions.value = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            annotation: {}
        },
        scales: {
            x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
            y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } }
        }
    };

    equipmentData.value = {
        labels: ['MRI', 'CT Scan', 'Cath Lab', 'Ventilators', 'Dialysis'],
        datasets: [
            {
                label: 'Utilization %',
                data: [85, 72, 90, 65, 78],
                backgroundColor: (context) => {
                    const val = context.dataset.data[context.dataIndex];
                    if (val >= 85) return '#EF4444';
                    if (val >= 70) return '#F59E0B';
                    return '#10B981';
                }
            }
        ]
    };

    equipmentOptions.value = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { max: 100, ticks: { color: textColorSecondary, callback: (v) => v + '%' }, grid: { color: surfaceBorder } },
            y: { ticks: { color: textColorSecondary }, grid: { display: false } }
        }
    };
};

onMounted(() => {
    generateBeds();
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
        <Card class="glass-card accent-border-cyan">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">BED OCCUPANCY</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0; color: var(--accent-primary);" class="mono-data">{{ bedOccupancy }}<span style="font-size: 0.9rem; color: var(--text-muted);">%</span></div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="text-muted" style="font-size: 0.75rem;">Target: 85%</span>
                    </div>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-cyan">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">AVG LENGTH OF STAY</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;" class="mono-data">3.8 <span style="font-size: 0.9rem; color: var(--text-muted);">Days</span></div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="text-warning" style="font-size: 0.8rem;"><i class="pi pi-arrow-up"></i> 0.3d</span>
                        <span class="text-muted" style="font-size: 0.75rem;">Bench: 3.5d</span>
                    </div>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-cyan">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">OT UTILIZATION</div>
                    <div style="font-size: 1.5rem; font-weight: 600; margin: 0.25rem 0;" class="mono-data">72%</div>
                    <ProgressBar :value="otUtilization" :showValue="false" style="height: 6px; background: var(--surface-border);" />
                    <span class="text-muted" style="font-size: 0.75rem; margin-top: 4px;">Target: 80%</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-emerald">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">OPD VOLUME TODAY</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;" class="mono-data">342</div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="text-success" style="font-size: 0.8rem;"><i class="pi pi-arrow-up"></i> vs 318</span>
                        <span class="text-muted" style="font-size: 0.75rem;">Yesterday</span>
                    </div>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">IPD ADMISSIONS</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;" class="mono-data">28</div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="text-warning" style="font-size: 0.8rem;"><i class="pi pi-arrow-down"></i> vs 31 avg</span>
                        <span class="text-muted" style="font-size: 0.75rem;">7-day</span>
                    </div>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">ER WAIT TIME</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0; color: var(--warning);" class="mono-data">18 <span style="font-size: 0.9rem; color: var(--text-muted);">min</span></div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="text-warning" style="font-size: 0.8rem;">⚠ Target: &lt;15m</span>
                    </div>
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 2 — Bed Grid + OT Schedule -->
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <Card class="glass-card" style="flex: 1 1 50%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Bed Availability Map</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
                <div v-else>
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                        <span style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
                            <span class="bed-cell bed-available" style="width: 14px; height: 14px;"></span> Available: 34
                        </span>
                        <span style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
                            <span class="bed-cell bed-occupied" style="width: 14px; height: 14px;"></span> Occupied: 118
                        </span>
                        <span style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
                            <span class="bed-cell bed-icu" style="width: 14px; height: 14px;"></span> ICU: 12
                        </span>
                        <span style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
                            <span class="bed-cell bed-maintenance" style="width: 14px; height: 14px;"></span> Maint: 6
                        </span>
                    </div>
                    <div class="bed-grid">
                        <div
                            v-for="(bed, i) in beds"
                            :key="i"
                            :class="['bed-cell', 'bed-' + bed]"
                            :title="bed.toUpperCase() + ' - Bed ' + (i + 1)"
                        ></div>
                    </div>
                </div>
            </template>
        </Card>

        <Card class="glass-card" style="flex: 1 1 45%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">OT Schedule Today</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
                <div v-else class="ot-schedule">
                    <div v-for="ot in otSchedule" :key="ot.ot" style="margin-bottom: 1rem;">
                        <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: var(--accent-primary);">{{ ot.ot }}</div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <div 
                                v-for="slot in ot.slots" 
                                :key="slot.time" 
                                class="ot-slot"
                                :style="{ borderLeft: '3px solid ' + getSlotColor(slot.status) }"
                            >
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                    <span class="mono-data" style="font-size: 0.75rem; color: var(--text-muted);">{{ slot.time }}</span>
                                    <Tag :value="slot.status" :severity="getSlotSeverity(slot.status)" style="font-size: 0.65rem; padding: 2px 6px;" />
                                </div>
                                <div style="font-size: 0.8rem; font-weight: 500;">{{ slot.procedure }}</div>
                                <div style="font-size: 0.7rem; color: var(--text-muted);">{{ slot.doctor }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 3 — Discharge Turnaround + Equipment Utilization -->
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <Card class="glass-card" style="flex: 1 1 55%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Discharge Turnaround Time (min)</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="280px" /></div>
                <div v-else style="height: 280px; width: 100%;">
                    <Chart type="bar" :data="dischargeData" :options="dischargeOptions" style="height: 100%; width: 100%;" />
                </div>
            </template>
        </Card>
        <Card class="glass-card" style="flex: 1 1 40%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Equipment Utilization</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="280px" /></div>
                <div v-else style="height: 280px; width: 100%;">
                    <Chart type="bar" :data="equipmentData" :options="equipmentOptions" style="height: 100%; width: 100%;" />
                </div>
            </template>
        </Card>
    </div>
  </div>
</template>

<style scoped>
.bed-grid {
    display: grid;
    grid-template-columns: repeat(17, 1fr);
    gap: 4px;
}

.bed-cell {
    aspect-ratio: 1;
    border-radius: 3px;
    min-width: 0;
    transition: transform 0.15s;
}
.bed-cell:hover {
    transform: scale(1.3);
    z-index: 2;
}

.bed-available { background: #10B981; }
.bed-occupied { background: #3B82F6; }
.bed-icu { background: #EF4444; }
.bed-maintenance { background: #F59E0B; }

.ot-slot {
    flex: 1 1 calc(50% - 8px);
    min-width: 140px;
    background: var(--strip-bg);
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid var(--surface-border);
    transition: background 0.2s;
}
.ot-slot:hover {
    background: var(--hover-bg);
}
</style>
