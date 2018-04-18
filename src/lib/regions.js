const regions = {
    brw: 'broward',
    chn: 'chennai',
    jbd: 'jakarta',
    sby: 'surabaya',
    srg: 'semarang',
    bdy: 'bandung',
};

export default (instanceRegionCode) => {
    if (instanceRegionCode in regions) {
        return regions[instanceRegionCode];
    } else {
        return null;
    }
};
