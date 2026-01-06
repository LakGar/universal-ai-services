# DNS Troubleshooting - Apex Domain Still Showing Old Site

## Step-by-Step Troubleshooting

### Step 1: Verify DNS Records Are Actually Updated

**Check what DNS records are actually live:**

1. **Use DNS lookup tools**:
   - Go to: https://dnschecker.org
   - Enter: `universalaiservices.com`
   - Select record type: **A** or **ANY**
   - Check results from multiple locations

2. **What to look for**:
   - Should show Vercel's IP addresses
   - Should NOT show Squarespace IPs (like `198.185.159.145` or `216.198.79.1`)
   - If you see Squarespace IPs, DNS hasn't updated yet

3. **Also check**:
   - https://www.whatsmydns.net/#A/universalaiservices.com
   - https://mxtoolbox.com/DNSLookup.aspx (enter `universalaiservices.com`)

### Step 2: Check Domain Registrar DNS (CRITICAL)

**This is often the issue!** Even if Vercel shows correct records, your domain registrar might have overriding records.

1. **Find where you bought the domain**:
   - GoDaddy
   - Namecheap
   - Google Domains
   - Cloudflare
   - Squarespace (if you bought it there)

2. **Log into your domain registrar**

3. **Go to DNS Management** (might be called):
   - DNS Settings
   - DNS Records
   - Advanced DNS
   - Name Servers

4. **Check for these records and DELETE them**:

   **A Records to Remove**:
   ```
   Type: A
   Name: @ (or blank, or universalaiservices.com)
   Value: 198.185.159.145 (Squarespace IP)
   Value: 216.198.79.1 (old IP)
   Value: Any Squarespace-related IP
   ```

   **CNAME Records to Remove**:
   ```
   Type: CNAME
   Name: @ (apex domain)
   Value: ext.squarespace.com (or similar)
   ```

   **ALIAS Records to Remove**:
   ```
   Type: ALIAS
   Name: @
   Value: Any Squarespace value
   ```

5. **What Should Be There**:

   **Option A: Using Vercel Nameservers** (Recommended):
   - Change nameservers to Vercel's nameservers
   - Remove ALL DNS records at registrar
   - Let Vercel manage everything

   **Option B: Managing DNS at Registrar**:
   - Keep only:
     - CNAME: `www` → `88777c230be8011f.vercel-dns-017.com.`
     - A record: `@` → Vercel's IP addresses (get from Vercel dashboard)
   - Remove all Squarespace records

### Step 3: Verify Nameservers

**Check if nameservers are pointing to Vercel:**

1. **Use nameserver lookup**:
   - Go to: https://mxtoolbox.com/SuperTool.aspx?action=ns%3auniversalaiservices.com
   - Or: https://www.whatsmydns.net/#NS/universalaiservices.com

2. **What you should see**:
   - If using Vercel nameservers: `ns1.vercel-dns.com`, `ns2.vercel-dns.com` (or similar)
   - If NOT using Vercel nameservers: Your registrar's nameservers

3. **If nameservers are NOT Vercel's**:
   - You need to manage DNS at your registrar
   - OR change nameservers to Vercel's

### Step 4: Clear All Caches

**DNS changes can be cached everywhere:**

1. **Clear Browser Cache**:
   - Chrome: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Select "Cached images and files"
   - Clear data

2. **Clear DNS Cache on Your Computer**:

   **Mac**:
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

   **Windows**:
   ```cmd
   ipconfig /flushdns
   ```

   **Linux**:
   ```bash
   sudo systemd-resolve --flush-caches
   # or
   sudo service network-manager restart
   ```

3. **Try Different Network**:
   - Use mobile data instead of WiFi
   - Or try a different WiFi network
   - This bypasses router DNS cache

4. **Try Incognito/Private Browsing**:
   - Opens a fresh session without cache

### Step 5: Check Vercel Domain Configuration

**Verify in Vercel Dashboard:**

1. **Go to Vercel Dashboard** → Your Project → Settings → Domains

2. **Check `universalaiservices.com`**:
   - Status should be "Valid Configuration"
   - Should show green checkmark
   - If it shows error, fix it

3. **Check DNS Records**:
   - Should show ALIAS records (auto-managed)
   - Should NOT show conflicting A records
   - If you see errors, fix them

4. **Check SSL Certificate**:
   - Should show "Valid" or "Provisioning"
   - If error, wait for DNS to propagate first

### Step 6: Force DNS Update at Registrar

**Some registrars need explicit save:**

1. **After making changes**:
   - Click "Save" or "Apply Changes"
   - Some registrars require this step

2. **Check for "Propagation" status**:
   - Some registrars show propagation status
   - Wait until it says "Complete"

### Step 7: Check Squarespace Settings

**If domain was connected to Squarespace:**

1. **Log into Squarespace**:
   - Go to: https://account.squarespace.com

2. **Find domain settings**:
   - Go to your site settings
   - Find domain/website settings

3. **Disconnect domain**:
   - Remove `universalaiservices.com` from Squarespace
   - This ensures Squarespace isn't trying to manage it

### Step 8: Wait for Propagation

**DNS changes can take time:**

- **Minimum**: 5-10 minutes
- **Typical**: 1-4 hours
- **Maximum**: 24-48 hours

**Check propagation status**:
- Use: https://dnschecker.org
- Enter: `universalaiservices.com`
- Check multiple locations
- Wait until ALL locations show new IPs

---

## Common Scenarios & Solutions

### Scenario 1: Nameservers Still Point to Squarespace

**Problem**: Nameservers at registrar still point to Squarespace

**Solution**:
1. Go to domain registrar
2. Change nameservers to Vercel's nameservers
3. Wait 24-48 hours for propagation

### Scenario 2: DNS Records at Registrar Override Vercel

**Problem**: Registrar has A records that override Vercel

**Solution**:
1. Go to registrar DNS management
2. Remove ALL A records for apex domain
3. Remove ALL Squarespace-related records
4. Add only Vercel's records (or use Vercel nameservers)

### Scenario 3: DNS Cached Everywhere

**Problem**: Old DNS cached in browser, computer, router, ISP

**Solution**:
1. Clear all caches (see Step 4)
2. Try different network
3. Use DNS checker tools to verify actual DNS
4. Wait for propagation

### Scenario 4: Domain Still Connected to Squarespace

**Problem**: Squarespace still thinks it owns the domain

**Solution**:
1. Log into Squarespace
2. Disconnect/remove domain from Squarespace
3. This releases the domain

---

## Quick Diagnostic Commands

**Check current DNS records**:
```bash
# Check A record
dig universalaiservices.com A

# Check all records
dig universalaiservices.com ANY

# Check nameservers
dig universalaiservices.com NS
```

**Check what IP domain resolves to**:
```bash
# Mac/Linux
nslookup universalaiservices.com

# Windows
nslookup universalaiservices.com
```

**Expected Result**: Should show Vercel's IP addresses, not Squarespace

---

## What to Check Right Now

1. ✅ **DNS Checker**: https://dnschecker.org - What IPs does it show?
2. ✅ **Domain Registrar**: What DNS records are there?
3. ✅ **Nameservers**: Where are they pointing?
4. ✅ **Vercel Dashboard**: Is domain showing as valid?
5. ✅ **Squarespace**: Is domain still connected there?

---

## Most Likely Issue

Based on your description, the **most likely issue** is:

**DNS records at your domain registrar are overriding Vercel's records**

**Solution**:
1. Go to where you bought the domain (registrar)
2. Find DNS management
3. Remove ALL A records for apex domain
4. Remove ALL Squarespace-related records
5. Either:
   - Use Vercel nameservers (recommended), OR
   - Add Vercel's A record IPs manually

---

## Need More Help?

**Share these details**:
1. Where did you buy the domain? (GoDaddy, Namecheap, etc.)
2. What does https://dnschecker.org show for `universalaiservices.com`?
3. What nameservers does https://mxtoolbox.com show?
4. What DNS records are in your domain registrar's dashboard?

This will help identify the exact issue!

