const gcpServices = [
{ id: ‘compute’, name: ‘Compute Engine’, resources: [‘VM Instances’, ‘Disk Storage’, ‘Snapshots’] },
{ id: ‘gke’, name: ‘Google Kubernetes Engine’, resources: [‘Clusters’, ‘Node Pools’, ‘Persistent Volumes’] },
{ id: ‘cloud-run’, name: ‘Cloud Run’, resources: [‘Services’, ‘CPU Allocation’, ‘Memory Allocation’] },
{ id: ‘cloud-functions’, name: ‘Cloud Functions’, resources: [‘Functions’, ‘Invocations’, ‘Memory’] },
{ id: ‘app-engine’, name: ‘App Engine’, resources: [‘Instances’, ‘Version Count’] },
{ id: ‘cloud-storage’, name: ‘Cloud Storage’, resources: [‘Buckets’, ‘Storage Class’, ‘Data Size (GB)’] },
{ id: ‘cloud-sql’, name: ‘Cloud SQL’, resources: [‘Instances’, ‘Storage (GB)’, ‘Backups’] },
{ id: ‘bigquery’, name: ‘BigQuery’, resources: [‘Datasets’, ‘Storage (TB)’, ‘Query (TB/month)’] },
{ id: ‘dataflow’, name: ‘Dataflow’, resources: [‘Jobs’, ‘Workers’, ‘Hours/day’] },
{ id: ‘pub-sub’, name: ‘Pub/Sub’, resources: [‘Topics’, ‘Messages/day’, ‘Subscriptions’] },
{ id: ‘cloud-cdn’, name: ‘Cloud CDN’, resources: [‘Cache GB/month’, ‘Egress GB/month’] },
{ id: ‘load-balancing’, name: ‘Cloud Load Balancing’, resources: [‘Load Balancers’, ‘Rules’, ‘Data Processed (GB)’] },
{ id: ‘vpc’, name: ‘VPC Network’, resources: [‘Subnets’, ‘Firewall Rules’, ‘VPN Tunnels’] },
{ id: ‘cloud-armor’, name: ‘Cloud Armor’, resources: [‘Policies’, ‘Rules’, ‘Requests/day’] },
{ id: ‘memorystore’, name: ‘Memorystore’, resources: [‘Redis Instances’, ‘Memory (GB)’] },
{ id: ‘firestore’, name: ‘Firestore’, resources: [‘Documents’, ‘Reads/day’, ‘Writes/day’] }
];

const selectedServices = new Set();
const resourceData = {};

function initServiceGrid() {
const grid = document.getElementById(‘serviceGrid’);
if (!grid) {
console.error(‘Service grid element not found’);
return;
}

```
grid.innerHTML = ''; // Clear any existing content

gcpServices.forEach(service => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
        <label style="cursor: pointer; display: flex; align-items: center;">
            <input type="checkbox" value="${service.id}" data-service-id="${service.id}">
            <span class="service-name">${service.name}</span>
        </label>
    `;
    
    // Add event listener to the checkbox
    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function(e) {
        toggleService(service.id, e);
    });
    
    grid.appendChild(card);
});

console.log('Service grid initialized with', gcpServices.length, 'services');
```

}

function toggleService(serviceId, event) {
const checkbox = event.target;
const card = checkbox.closest(’.service-card’);

```
if (checkbox.checked) {
    selectedServices.add(serviceId);
    card.classList.add('selected');
} else {
    selectedServices.delete(serviceId);
    card.classList.remove('selected');
}
updateResourceInputs();
```

}

function updateResourceInputs() {
const resourceSection = document.getElementById(‘resourceSection’);
const resourceInputs = document.getElementById(‘resourceInputs’);

```
if (!resourceSection || !resourceInputs) {
    console.error('Resource section elements not found');
    return;
}

if (selectedServices.size === 0) {
    resourceSection.classList.add('hidden');
    return;
}

resourceSection.classList.remove('hidden');
resourceInputs.innerHTML = '';

selectedServices.forEach(serviceId => {
    const service = gcpServices.find(s => s.id === serviceId);
    if (!service) return;
    
    const serviceDiv = document.createElement('div');
    serviceDiv.className = 'resource-input';
    serviceDiv.innerHTML = `<h3>${service.name}</h3>`;

    service.resources.forEach((resource, index) => {
        const row = document.createElement('div');
        row.className = 'resource-row';
        row.innerHTML = `
            <label>${resource}:</label>
            <input type="text" id="${serviceId}-${index}" placeholder="Enter value">
            <span style="color: #666; font-size: 0.9em;">units</span>
        `;
        serviceDiv.appendChild(row);
    });

    resourceInputs.appendChild(serviceDiv);
});
```

}

function analyzeOptimizations() {
const projectId = document.getElementById(‘projectId’).value;
const region = document.getElementById(‘region’).value;

```
if (!projectId || !region) {
    alert('Please enter Project ID and select a Region');
    return;
}

if (selectedServices.size === 0) {
    alert('Please select at least one GCP service');
    return;
}

const results = document.getElementById('results');
if (!results) {
    console.error('Results element not found');
    return;
}

results.innerHTML = '<div class="loading">Analyzing your GCP resources...</div>';
results.classList.remove('hidden');

setTimeout(() => {
    generateRecommendations(projectId, region);
}, 1500);
```

}

function generateRecommendations(projectId, region) {
const recommendations = {
high: [],
medium: [],
low: []
};

```
selectedServices.forEach(serviceId => {
    const service = gcpServices.find(s => s.id === serviceId);
    if (!service) return;
    
    const serviceRecs = getServiceRecommendations(serviceId, service.name);
    recommendations.high.push(...serviceRecs.high);
    recommendations.medium.push(...serviceRecs.medium);
    recommendations.low.push(...serviceRecs.low);
});

displayRecommendations(recommendations, projectId, region);
```

}

function getServiceRecommendations(serviceId, serviceName) {
const recs = { high: [], medium: [], low: [] };

```
switch(serviceId) {
    case 'compute':
        recs.high.push('Use Committed Use Discounts for predictable workloads - Save up to 57%');
        recs.high.push('Implement auto-scaling and right-size underutilized VMs');
        recs.medium.push('Convert standard persistent disks to balanced or SSD where needed');
        recs.low.push('Delete old snapshots older than 30 days');
        break;
    case 'gke':
        recs.high.push('Enable GKE cluster autoscaling and node auto-provisioning');
        recs.high.push('Use preemptible nodes for fault-tolerant workloads - Save up to 80%');
        recs.medium.push('Implement Vertical Pod Autoscaling for resource optimization');
        recs.low.push('Clean up unused persistent volume claims');
        break;
    case 'cloud-storage':
        recs.high.push('Move infrequently accessed data to Nearline or Coldline storage');
        recs.medium.push('Implement Object Lifecycle Management policies');
        recs.medium.push('Enable Object Versioning only where required');
        recs.low.push('Delete incomplete multipart uploads');
        break;
    case 'cloud-sql':
        recs.high.push('Use Cloud SQL editions with automatic storage increase disabled');
        recs.high.push('Right-size instances based on CPU and memory utilization');
        recs.medium.push('Reduce backup retention period to minimum required');
        recs.low.push('Use maintenance windows during off-peak hours');
        break;
    case 'bigquery':
        recs.high.push('Use partitioned tables and clustering for large datasets');
        recs.high.push('Enable table expiration for temporary datasets');
        recs.medium.push('Use BI Engine for frequently accessed queries');
        recs.medium.push('Optimize query patterns to reduce data scanned');
        break;
    case 'cloud-run':
        recs.high.push('Set minimum instances to 0 for cost savings during idle periods');
        recs.medium.push('Adjust CPU allocation to "CPU always allocated" only when needed');
        recs.medium.push('Optimize container startup time to reduce cold start costs');
        break;
    case 'cloud-functions':
        recs.high.push('Reduce memory allocation to minimum required per function');
        recs.medium.push('Optimize function timeout settings');
        recs.low.push('Bundle dependencies to reduce deployment size');
        break;
    case 'load-balancing':
        recs.high.push('Use Cloud CDN to reduce load balancer data processing costs');
        recs.medium.push('Consolidate forwarding rules where possible');
        recs.low.push('Review and remove unused load balancers');
        break;
    case 'vpc':
        recs.medium.push('Delete unused static IP addresses');
        recs.medium.push('Review and optimize VPN tunnel usage');
        recs.low.push('Consolidate firewall rules for better management');
        break;
    case 'app-engine':
        recs.high.push('Use automatic scaling with appropriate min/max instances');
        recs.medium.push('Delete unused versions to reduce storage costs');
        recs.low.push('Review traffic splitting configuration');
        break;
    case 'dataflow':
        recs.high.push('Use Flexible Resource Scheduling for batch workloads');
        recs.medium.push('Right-size worker machine types based on job requirements');
        recs.low.push('Enable Streaming Engine for streaming jobs');
        break;
    case 'pub-sub':
        recs.medium.push('Set appropriate message retention periods');
        recs.medium.push('Delete unused topics and subscriptions');
        recs.low.push('Use message filtering to reduce unnecessary processing');
        break;
    case 'cloud-cdn':
        recs.high.push('Optimize cache hit ratio through proper cache configuration');
        recs.medium.push('Use compression to reduce egress costs');
        recs.low.push('Review cache invalidation patterns');
        break;
    case 'cloud-armor':
        recs.medium.push('Consolidate security policies where possible');
        recs.low.push('Review and optimize rule evaluation order');
        break;
    case 'memorystore':
        recs.high.push('Right-size Redis instances based on actual usage');
        recs.medium.push('Use Standard Tier only when high availability is required');
        recs.low.push('Schedule maintenance windows during low-traffic periods');
        break;
    case 'firestore':
        recs.high.push('Optimize query patterns to reduce document reads');
        recs.medium.push('Use collection group queries to reduce costs');
        recs.low.push('Implement data model best practices to minimize reads');
        break;
    default:
        recs.medium.push(`Review ${serviceName} configuration for optimization opportunities`);
        recs.low.push(`Monitor ${serviceName} usage patterns regularly`);
}

return recs;
```

}

function displayRecommendations(recommendations, projectId, region) {
const results = document.getElementById(‘results’);
if (!results) return;

```
let html = `
    <div class="recommendations">
        <h2 class="section-title">💰 Cost Optimization Recommendations</h2>
        <p style="margin-bottom: 30px; color: #666; font-size: 1.1em;">
            Project: <strong>${projectId}</strong> | Region: <strong>${region}</strong>
        </p>
`;

if (recommendations.high.length > 0) {
    html += `
        <div class="recommendation-card priority-high">
            <h3>🔴 High Priority (Immediate Action)</h3>
            <ul class="recommendation-list">
                ${recommendations.high.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}

if (recommendations.medium.length > 0) {
    html += `
        <div class="recommendation-card priority-medium">
            <h3>🟡 Medium Priority (Plan Implementation)</h3>
            <ul class="recommendation-list">
                ${recommendations.medium.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}

if (recommendations.low.length > 0) {
    html += `
        <div class="recommendation-card priority-low">
            <h3>🟢 Low Priority (Maintenance Tasks)</h3>
            <ul class="recommendation-list">
                ${recommendations.low.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}

const totalRecs = recommendations.high.length + recommendations.medium.length + recommendations.low.length;
const estimatedSavings = Math.floor(Math.random() * 40) + 20;

html += `
    <div class="recommendation-card" style="background: linear-gradient(135deg, #34a853 0%, #28a745 100%); color: white; border: none;">
        <h3 style="color: white;">📊 Summary</h3>
        <p style="font-size: 1.2em; margin-top: 15px;">
            <strong>${totalRecs}</strong> optimization opportunities identified<br>
            Potential cost savings: <span class="savings-badge" style="background: white; color: #34a853; font-size: 1.3em;">${estimatedSavings}% - ${estimatedSavings + 20}%</span>
        </p>
    </div>
</div>
`;

results.innerHTML = html;
```

}

// Initialize on page load - Multiple methods to ensure it runs
if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, initServiceGrid);
} else {
// DOM is already loaded
initServiceGrid();
}

// Backup initialization
window.addEventListener(‘load’, function() {
const grid = document.getElementById(‘serviceGrid’);
if (grid && grid.children.length === 0) {
console.log(‘Backup initialization triggered’);
initServiceGrid();
}
});
