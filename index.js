const express = require('express');
const dns = require('dns').promises;

const app = express();

app.get('/check-dmarc', async (req, res) => {
    const domain = req.query.domain;
    const dmarcRecord = `_dmarc.${domain}`;

    try {
        const records = await dns.resolveTxt(dmarcRecord);
        const dmarc = records.find(record => record[0].startsWith('v=DMARC1'));
        
        if (dmarc) {
            res.json({ dmarc: dmarc[0] });
        } else {
            res.json({ dmarc: null });
        }
    } catch (error) {
        res.status(500).json({ error: "No DMARC record found or DNS query failed." });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
