<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import Skeleton from 'primevue/skeleton';
import Message from 'primevue/message';

const loading = ref(true);

const nabhScore = ref(86);
const consentRate = ref(94.2);
const auditsDone = ref(80); // 8/10 = 80%
const digitalCompliance = ref(72);

const nabhChecklist = ref([
    { chapter: 'Infrastructure', status: 'Compliant', score: 92, lastAudit: 'Mar 15, 2026' },
    { chapter: 'Patient Rights', status: 'Compliant', score: 88, lastAudit: 'Mar 15, 2026' },
    { chapter: 'Clinical Care', status: 'Partial', score: 78, lastAudit: 'Feb 20, 2026' },
    { chapter: 'Infection Control', status: 'Non-compliant', score: 62, lastAudit: 'Feb 20, 2026' },
    { chapter: 'Continuous Quality', status: 'Compliant', score: 90, lastAudit: 'Mar 15, 2026' },
    { chapter: 'Nursing Excellence', status: 'Partial', score: 76, lastAudit: 'Jan 10, 2026' },
    { chapter: 'Safety Management', status: 'Compliant', score: 94, lastAudit: 'Mar 15, 2026' },
    { chapter: 'Information Mgmt', status: 'Compliant', score: 85, lastAudit: 'Feb 20, 2026' },
]);

const auditTimeline = ref([
    { date: 'Apr 28', event: 'Internal Quality Audit', type: 'Audit', status: 'Scheduled' },
    { date: 'May 10', event: 'NABH Mock Assessment', type: 'NABH', status: 'Scheduled' },
    { date: 'May 20', event: 'Fire Safety Inspection', type: 'Safety', status: 'Scheduled' },
    { date: 'Jun 01', event: 'PCPNDT License Renewal', type: 'License', status: 'Pending' },
    { date: 'Jun 15', event: 'Radiation Safety Audit', type: 'Safety', status: 'Scheduled' },
    { date: 'Jul 01', event: 'NABH Main Assessment', type: 'NABH', status: 'Upcoming' },
]);

const getChapterSeverity = (status) => {
    switch (status) {
        case 'Compliant': return 'success';
        case 'Partial': return 'warn';
        case 'Non-compliant': return 'danger';
        default: return null;
    }
};

const getTimelineColor = (type) => {
    switch (type) {
        case 'Audit': return '#00C2FF';
        case 'NABH': return '#7C3AED';
        case 'Safety': return '#F59E0B';
        case 'License': return '#EF4444';
        default: return '#6B7280';
    }
};

onMounted(() => {
    setTimeout(() => { loading.value = false; }, 800);
});
</script>

<template>
  <div class="animate-card" style="display: flex; flex-direction: column; gap: 1.5rem;">
    <!-- ROW 1 — Compliance Score Cards -->
    <div class="grid-container grid-cols-5">
        <Card class="glass-card accent-border-cyan">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="5rem" /></div>
                <div v-else style="text-align: center;">
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500; margin-bottom: 8px;">NABH Readiness</div>
                    <div class="compliance-ring">
                        <svg viewBox="0 0 36 36" width="80" height="80">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="#1E2A3B" stroke-width="3" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="#00C2FF" stroke-width="3"
                                :stroke-dasharray="nabhScore + ', 100'" stroke-linecap="round" />
                            <text x="18" y="20.35" fill="#F9FAFB" font-size="8" text-anchor="middle" font-family="IBM Plex Mono">{{ nabhScore }}%</text>
                        </svg>
                    </div>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="5rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">Consent Completion</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.5rem 0;">94.2%</div>
                    <ProgressBar :value="consentRate" :showValue="false" style="height: 6px; background: var(--surface-border);" />
                    <span class="text-warning" style="font-size: 0.75rem; margin-top: 4px;">⚠ Target: 100%</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-emerald">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="5rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">Audit Completion</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.5rem 0;">8 / 10</div>
                    <ProgressBar :value="auditsDone" :showValue="false" style="height: 6px; background: var(--surface-border);" />
                    <span class="text-muted" style="font-size: 0.75rem; margin-top: 4px;">This quarter</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-red">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="5rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">Medico-legal Flags</div>
                    <div style="display: flex; align-items: center; gap: 12px; margin-top: 0.5rem;">
                        <span style="font-size: 2rem; font-weight: 700; color: var(--danger);">3</span>
                        <Badge value="Open" severity="danger" />
                    </div>
                    <span class="text-danger" style="font-size: 0.75rem; margin-top: 4px;">Requires attention</span>
                </div>
            </template>
        </Card>

        <Card class="glass-card accent-border-amber">
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="5rem" /></div>
                <div v-else>
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 500;">Digital Compliance</div>
                    <div style="font-size: 1.7rem; font-weight: 600; margin: 0.5rem 0; color: var(--warning);">72%</div>
                    <ProgressBar :value="digitalCompliance" :showValue="false" style="height: 6px; background: var(--surface-border);" />
                    <span class="text-warning" style="font-size: 0.75rem; margin-top: 4px;">HL7/ABDM</span>
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 2 — NABH Checklist + Audit Timeline -->
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <Card class="glass-card" style="flex: 1 1 50%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">NABH Compliance Checklist</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
                <DataTable v-else :value="nabhChecklist" responsiveLayout="scroll" class="p-datatable-sm">
                    <Column field="chapter" header="Chapter"></Column>
                    <Column header="Status">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getChapterSeverity(slotProps.data.status)" style="font-size: 0.75rem;" />
                        </template>
                    </Column>
                    <Column header="Score">
                        <template #body="slotProps">
                            <span :style="{ color: slotProps.data.score >= 80 ? 'var(--success)' : slotProps.data.score >= 70 ? 'var(--warning)' : 'var(--danger)' }">
                                {{ slotProps.data.score }}%
                            </span>
                        </template>
                    </Column>
                    <Column field="lastAudit" header="Last Audit"></Column>
                </DataTable>
            </template>
        </Card>

        <Card class="glass-card" style="flex: 1 1 45%; min-width: 0;">
            <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Upcoming Audits & Deadlines</span></template>
            <template #content>
                <div v-if="loading"><Skeleton width="100%" height="300px" /></div>
                <div v-else class="audit-timeline">
                    <div v-for="(item, i) in auditTimeline" :key="i" class="timeline-item">
                        <div class="timeline-dot" :style="{ background: getTimelineColor(item.type) }"></div>
                        <div class="timeline-content">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 600; font-size: 0.9rem;">{{ item.event }}</span>
                                <span class="text-muted" style="font-size: 0.75rem;">{{ item.date }}</span>
                            </div>
                            <div style="display: flex; gap: 8px; margin-top: 4px;">
                                <Tag :value="item.type" style="font-size: 0.65rem; background: rgba(255,255,255,0.05); color: var(--text-muted);" />
                                <Tag :value="item.status" severity="info" style="font-size: 0.65rem;" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
    </div>

    <!-- ROW 3 — Compliance Alerts -->
    <Card class="glass-card">
        <template #title><span style="font-size: 1.1rem; color: var(--text-primary);">Active Compliance Alerts</span></template>
        <template #content>
            <div v-if="loading"><Skeleton width="100%" height="120px" /></div>
            <div v-else style="display: flex; flex-direction: column; gap: 0.75rem;">
                <Message severity="error" :closable="false">
                    <span style="font-size: 0.9rem;">Medico-legal case #ML-2024-07 requires response by <strong>25 Apr</strong></span>
                </Message>
                <Message severity="warn" :closable="false">
                    <span style="font-size: 0.9rem;">NABH criterion B3.2 non-compliant — <strong>action pending</strong></span>
                </Message>
                <Message severity="warn" :closable="false">
                    <span style="font-size: 0.9rem;">Consent form missing for <strong>12 IPD patients</strong></span>
                </Message>
            </div>
        </template>
    </Card>
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

.compliance-ring {
    display: flex;
    justify-content: center;
}

.audit-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
}
.timeline-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-left: 2px solid var(--surface-border);
    margin-left: 8px;
    padding-left: 20px;
    position: relative;
    transition: background 0.2s;
}
.timeline-item:hover {
    background: rgba(255,255,255,0.02);
}
.timeline-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;
    left: -7px;
    top: 16px;
}
.timeline-content {
    flex: 1;
}
</style>
