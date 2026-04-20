<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Knob from 'primevue/knob';
import Chip from 'primevue/chip';
import Skeleton from 'primevue/skeleton';

const loading = ref(true);
const claimDenialValue = ref(4.2);

const revenueData = ref(null);
const revenueOptions = ref(null);
const departmentData = ref(null);
const departmentOptions = ref(null);
const denialData = ref(null);
const denialOptions = ref(null);

const accountsReceivable = ref([
    { name: 'Ramesh Kumar', amount: '₹1,40,000', days: 45, status: 'Overdue', insurer: 'Star Health' },
    { name: 'Srinivas Rao', amount: '₹85,000', days: 12, status: 'Pending', insurer: 'HDFC Ergo' },
    { name: 'Corporate Acct (TCS)', amount: '₹14,50,000', days: 65, status: 'Critical', insurer: 'TCS Health' },
    { name: 'Laxmi Devi', amount: '₹42,000', days: 28, status: 'Pending', insurer: 'SBI General' },
    { name: 'Anil Reddy', amount: '₹2,10,000', days: 110, status: 'Critical', insurer: 'Apollo Munich' },
    { name: 'Meena Kumari', amount: '₹18,000', days: 5, status: 'New', insurer: 'Self' },
    { name: 'Venkat Sai', amount: '₹95,000', days: 40, status: 'Overdue', insurer: 'ICICI Lombard' },
]);

const getStatusSeverity = (status) => {
    switch (status) {
        case 'New': return 'success';
        case 'Pending': return 'info';
        case 'Overdue': return 'warning';
        case 'Critical': return 'danger';
        default: return null;
    }
};

const setupCharts = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-primary') || '#F9FAFB';
    const textColorSecondary = documentStyle.getPropertyValue('--text-muted') || '#6B7280';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#1E2A3B';

    revenueData.value = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
            {
                type: 'bar',
                label: 'Gross Revenue',
                backgroundColor: '#7C3AED',
                data: [6.1, 6.4, 6.2, 6.8, 6.5, 7.1]
            },
            {
                type: 'bar',
                label: 'Expenses',
                backgroundColor: '#EF4444',
                data: [4.8, 5.0, 5.1, 4.9, 5.2, 5.0]
            },
            {
                type: 'line',
                label: 'Net Margin',
                borderColor: '#10B981',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                order: 1,
                yAxisID: 'y1',
                data: [1.3, 1.4, 1.1, 1.9, 1.3, 2.1]
            }
        ]
    };

    revenueOptions.value = {
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: textColor } }
        },
        scales: {
            x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
            y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
            y1: { 
                type: 'linear', 
                display: false, // hide the axis labels to keep it clean
                position: 'right', 
                min: 0, 
                max: 3.5, // lower max brings the line up
                grid: { drawOnChartArea: false } 
            }
        }
    };

    departmentData.value = {
        labels: ['Cardiology', 'Orthopedics', 'Oncology', 'Neurology', 'Emergency', 'Pediatrics'],
        datasets: [
            {
                label: 'Profitability (₹ Cr)',
                data: [1.2, 0.9, 0.7, 0.4, -0.2, 0.3],
                backgroundColor: (context) => {
                    if (!context.chart.data.datasets[0].data[context.dataIndex]) return '#10B981';
                    const val = context.chart.data.datasets[0].data[context.dataIndex];
                    return val < 0 ? '#EF4444' : '#10B981';
                }
            }
        ]
    };

    departmentOptions.value = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
            y: { ticks: { color: textColorSecondary }, grid: { display: false } }
        }
    };

    denialData.value = {
        labels: ['Missing Info', 'Duplicate', 'Not Covered', 'Auth Failed', 'Late'],
        datasets: [
            {
                data: [40, 20, 15, 15, 10],
                backgroundColor: ['#00C2FF', '#7C3AED', '#EF4444', '#F59E0B', '#10B981'],
                hoverBackgroundColor: ['#00aae6', '#6b2ed1', '#dc3838', '#e09003', '#0e9d6d'],
                borderColor: surfaceBorder
            }
        ]
    };

    denialOptions.value = {
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: { position: 'right', labels: { color: textColor } }
        }
    };
};

onMounted(() => {
    setupCharts();
    setTimeout(() => { loading.value = false; }, 800);
});
</script>

<template>
  <div class="animate-card" style="display: flex; flex-direction: column; gap: 1.5rem;">
    <!-- ROW 1 -->
    <div class="grid-container grid-cols-6">
        <Card class="glass-card accent-border-violet">
            <template #content>
                <div v-if="loading" ><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">Gross Revenue</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;">₹6.8 Cr</div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="text-success" style="font-size: 0.8rem;"><i class="pi pi-arrow-up"></i> 4.2%</span>
                        <span class="text-muted" style="font-size: 0.75rem;">Target: ₹7.0 Cr</span>
                    </div>
                </div>
            </template>
        </Card>
        
        <Card class="glass-card accent-border-violet">
            <template #content>
                <div v-if="loading" ><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">Net Revenue</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;">₹4.2 Cr</div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="text-muted" style="font-size: 0.8rem;">After deductions</span>
                    </div>
                </div>
            </template>
        </Card>
        
        <Card class="glass-card accent-border-emerald">
            <template #content>
                <div v-if="loading" ><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">Collections</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;">₹3.9 Cr</div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="text-success" style="font-size: 0.8rem;">Eff: 92.8%</span>
                    </div>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">Accounts REC.</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;">₹1.4 Cr</div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <span style="font-size: 0.72rem; color: var(--success);">&lt;30d</span>
                        <span style="font-size: 0.72rem; color: var(--warning);">30-60d</span>
                        <span style="font-size: 0.72rem; color: var(--danger);">60d+</span>
                    </div>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-red">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else style="display: flex; align-items: flex-start; justify-content: space-between;">
                    <div>
                        <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">Denial Rate</div>
                        <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0; color: var(--danger);">4.2%</div>
                        <div class="text-muted" style="font-size: 0.72rem;">Bench: &lt;3%</div>
                    </div>
                    <Knob v-model="claimDenialValue" :min="0" :max="10" readonly valueColor="var(--danger)" rangeColor="var(--surface-border)" :size="48" :strokeWidth="8" />
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-violet">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="4rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.85rem; font-weight: 500;">Outstanding Dues</div>
                    <div style="font-size: 1.8rem; font-weight: 600; margin: 0.25rem 0;">₹48 L</div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span class="text-muted" style="font-size: 0.75rem;">Ins / Corp / Pat</span>
                    </div>
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 2 -->
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <Card class="glass-card" style="flex: 1 1 60%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Revenue vs Expenses (Last 6 Months)</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
                <div v-else style="height: 300px; width: 100%;">
                    <Chart type="bar" :data="revenueData" :options="revenueOptions" style="height: 100%; width: 100%;" />
                </div>
            </template>
        </Card>
        <Card class="glass-card" style="flex: 1 1 30%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Dept Profitability</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
                <div v-else style="height: 300px; width: 100%;">
                    <Chart type="bar" :data="departmentData" :options="departmentOptions" style="height: 100%; width: 100%;" />
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 3 -->
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <Card class="glass-card" style="flex: 1 1 60%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">AR Aging (Top 10)</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="250px" /></div>
                <DataTable v-else :value="accountsReceivable" paginator :rows="4" responsiveLayout="scroll" class="p-datatable-sm">
                    <Column field="name" header="Patient/Corp"></Column>
                    <Column field="insurer" header="Insurer"></Column>
                    <Column field="amount" header="Amount"></Column>
                    <Column field="days" header="Days O/S"></Column>
                    <Column header="Status">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" style="font-size: 0.75rem;" />
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
        <Card class="glass-card" style="flex: 1 1 30%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Denial Reasons</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="250px" /></div>
                <div v-else style="height: 250px; width: 100%; display: flex; align-items: center; justify-content: center;">
                    <Chart type="doughnut" :data="denialData" :options="denialOptions" style="height: 100%; width: 100%;" />
                </div>
            </template>
        </Card>
    </div>
  </div>
</template>
