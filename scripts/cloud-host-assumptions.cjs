// Public codes are defined in data/cloud/README.md; verbose migration evidence stays in reports/.
const definitions = {
  'historical-host': 'Historical source configuration, not inferred from the previous impact.',
  'cpu-proxy': 'Instance CPU references are modeling inputs, not verified host inventory.',
  'max-impact': 'Highest allocated impact among compatible modeled candidates; not a proven physical upper bound.',
  'published-sockets': 'Socket count taken from a compatible dedicated-host family.',
  'inferred-sockets': 'Sockets inferred from CPU capacity; architecture defaults apply when unknown.',
  'baremetal-proxy': 'Published bare-metal resources proxy the host; placement and reserved capacity remain unknown.',
  'family-proxy': 'Compatible family configuration proxies the host; not verified deployed hardware.',
  'largest-size-vcpu': 'Host vCPU envelope uses the largest matching SKU, without an additional SMT multiplier.',
  'catalog-proxy': 'Largest matching catalog SKU proxies the host; exposed RAM and inferred components are used.',
  'dedicated-host-proxy': 'Published dedicated-host capacity proxies ordinary VM hosting; actual placement is unknown.',
  'sole-tenant-proxy': 'Published sole-tenant capacity and sockets proxy ordinary VM hosting.',
  'dedicated-fallback': 'Unknown physical mapping: dedicated-equivalent envelope allocated at 100%.',
  'desktop-fallback': 'Desktop uses the rack-equivalent base; not a product LCA or proven upper bound.',
  'one-ssd': 'One physical local SSD assumed; guest partitions are not physical drives.',
  'one-hdd': 'One physical local HDD assumed; actual drive count is unknown.',
  'storage-proxy': 'Local physical drive count is modeled, not inferred from guest partition count.',
  'non-gpu-proxy': 'ASIC/FPGA uses the same board and memory coefficients as GPUs; quantities are board equivalents.',
  'accelerator-memory-default': 'Unknown accelerator memory uses a 16 GB placeholder.',
  'gpu-host-proxy': 'Full GPU-family configuration proxies the host; numeric hardware assumptions are stored in the profile.',
  'hbm-ram-proxy': 'HBM uses the ordinary RAM coefficient, not a separate manufacturing factor.',
  'installed-ram-proxy': 'Installed RAM is modeled from the family envelope rather than guest-available RAM.',
  'storage-pools': 'Diskless and local-storage variants use separate modeled host pools.',
  'cpu-generation-proxy': 'Host envelope is specific to the modeled CPU generation.',
  'interconnect-excluded': 'Additional interconnect hardware is excluded from the model.',
  'installed-vram': 'Installed GPU memory is used rather than guest-usable memory.',
  'remote-storage-excluded': 'Remote block storage is excluded from host manufacturing impact.'
};

const rules = [
  [/^Original Teads host inputs/, ['historical-host']],
  [/^CPU references are model inputs/, ['cpu-proxy']],
  [/^Selected by highest allocated impact/, ['max-impact']],
  [/^Socket count from (the documented|compatible) Dedicated Host/, ['published-sockets']],
  [/^One local HDD assumed/, ['one-hdd']],
  [/^Bare-metal exposed resources/, ['baremetal-proxy']],
  [/^Smallest compatible bare-metal/, ['baremetal-proxy', 'family-proxy']],
  [/^(Assume a full c7i|Use metal-|Small network-specialized|Use the 192-core|metal-)/, ['family-proxy', 'inferred-sockets']],
  [/^Allocatable host vCPU capacity/, ['largest-size-vcpu']],
  [/^Socket count inferred from CPU catalog/, ['inferred-sockets']],
  [/^D4B non-GPU extension/, ['non-gpu-proxy']],
  [/^Unpublished accelerator memory/, ['accelerator-memory-default']],
  [/^Full g7\./, ['gpu-host-proxy', 'inferred-sockets', 'storage-proxy']],
  [/^(One local SSD|One physical SSD|One local physical SSD)/, ['one-ssd']],
  [/^Unknown physical mapping/, ['dedicated-fallback']],
  [/^Apple desktop/, ['desktop-fallback']],
  [/^Burstable two-vCPU/, ['family-proxy', 'installed-ram-proxy']],
  [/^(Illustrative scenario only|RAM is exposed RAM|Largest catalog size)/, ['catalog-proxy', 'inferred-sockets', 'storage-proxy']],
  [/^Apply shared Azure host conventions.*HBM/, ['family-proxy', 'hbm-ram-proxy']],
  [/^Apply shared Azure host conventions/, ['family-proxy']],
  [/^Published Dedicated Host available RAM/, ['dedicated-host-proxy']],
  [/^Socket count inferred from physical cores/, ['inferred-sockets', 'one-ssd']],
  [/^Sockets inferred from host cores/, ['inferred-sockets']],
  [/^(A local temporary disk|Local physical storage count)/, ['storage-proxy']],
  [/^(Official sole-tenant|Published sole-tenant)/, ['sole-tenant-proxy']],
  [/^GPU count from the largest/, ['gpu-host-proxy']],
  [/^Highmem whole-host RAM proxy.*distinct bare-metal/, ['installed-ram-proxy', 'storage-pools', 'storage-proxy', 'baremetal-proxy']],
  [/^Highmem whole-host RAM proxy/, ['installed-ram-proxy', 'storage-pools', 'storage-proxy']],
  [/^24-vCPU non-local-SSD/, ['cpu-generation-proxy', 'installed-ram-proxy']],
  [/^Whole-host RAM proxy/, ['installed-ram-proxy', 'storage-proxy']],
  [/^Bare-metal RAM; socket count/, ['baremetal-proxy', 'inferred-sockets', 'interconnect-excluded']],
  [/^CPU sockets inferred from OCPU/, ['inferred-sockets', 'baremetal-proxy']],
  [/^Same-generation bare-metal/, ['baremetal-proxy']],
  [/^Bare-metal RAM and local drive counts.*Installed GPU memory/, ['baremetal-proxy', 'inferred-sockets', 'installed-vram']],
  [/^Bare-metal RAM and local drive counts/, ['baremetal-proxy', 'inferred-sockets']],
  [/^(Full eight-H200|Four-V100|Eight B300)/, ['gpu-host-proxy', 'installed-ram-proxy', 'inferred-sockets', 'storage-proxy']],
  [/^Assume one (full 128-core|shared 64-core)/, ['family-proxy', 'installed-ram-proxy', 'remote-storage-excluded']]
];

function normalizeHost(host) {
  const assumptions = host.assumptions.flatMap(note => {
    if (Object.hasOwn(definitions, note)) return [note];
    const rule = rules.find(([pattern]) => pattern.test(note));
    if (!rule) throw Error(`Unmapped host assumption: ${note}`);
    return rule[1];
  });
  return {...host,
    id:host.id.replace(/-teads-/gi, '-'),
    name:host.name.replace(/Teads\s+/gi, ''),
    basis:host.basis.replace('teads-source-reconstruction', 'historical-source-reconstruction'),
    assumptions:[...new Set(assumptions)].filter(code =>
      (code !== 'one-ssd' || host.ssd_count === 1) &&
      (code !== 'one-hdd' || host.hdd_count === 1) &&
      (code !== 'inferred-sockets' || !assumptions.includes('published-sockets'))
    ).sort()
  };
}
module.exports = {definitions, normalizeHost};
