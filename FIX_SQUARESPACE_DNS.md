# Fix Squarespace DNS Conflict

## The Problem

You have:
1. ❌ **A record in Vercel**: `216.198.79.1` (conflicting with ALIAS)
2. ❌ **Squarespace still connected**: Telling you to add A record `198.49.23.144`
3. ✅ **ALIAS records in Vercel**: Should handle apex domain automatically

## Solution: Remove Conflicts & Disconnect Squarespace

### Step 1: Remove A Record from Vercel (CRITICAL)

**In Vercel Dashboard**:

1. Go to **Settings** → **Domains**
2. Click on `universalaiservices.com` (the apex domain)
3. Find the **A record** with value `216.198.79.1`
4. **DELETE/REMOVE this A record**
5. Save changes

**Why**: The ALIAS records will handle the apex domain automatically. The A record is conflicting.

### Step 2: Disconnect Domain from Squarespace (CRITICAL)

**In Squarespace Dashboard**:

1. **Log into Squarespace**: https://account.squarespace.com
2. **Go to your site** (the old one)
3. **Settings** → **Domains** (or Website → Domains)
4. **Find `universalaiservices.com`**
5. **Click "Disconnect" or "Remove"** the domain
6. **Confirm** you want to disconnect it

**This is important**: Squarespace is still trying to manage the domain, which causes conflicts.

### Step 3: Check Domain Registrar DNS

**Go to where you bought the domain** (GoDaddy, Namecheap, etc.):

1. **Log into your domain registrar**
2. **Go to DNS Management**
3. **Remove ALL Squarespace-related records**:

   **Remove these if they exist**:
   ```
   Type: A
   Name: @ (or blank)
   Value: 198.49.23.144 (Squarespace IP)
   Value: 216.198.79.1 (old IP)
   Value: 198.185.159.145 (another Squarespace IP)
   ```

   **Remove these CNAME records if they exist**:
   ```
   Type: CNAME
   Name: @
   Value: ext.squarespace.com (or similar)
   ```

4. **What should remain**:
   - `www` CNAME → `88777c230be8011f.vercel-dns-017.com.`
   - OR use Vercel nameservers (recommended - see Step 4)

### Step 4: Use Vercel Nameservers (Recommended)

**Best Solution**: Let Vercel manage everything

1. **In Vercel Dashboard**:
   - Go to **Settings** → **Domains**
   - Click on `universalaiservices.com`
   - Look for **"Nameservers"** section
   - Copy the nameservers (usually something like):
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`

2. **At Your Domain Registrar**:
   - Go to **Nameserver Settings** (or DNS Settings)
   - **Change nameservers** to Vercel's nameservers
   - **Remove ALL DNS records** at registrar
   - Save changes

3. **Benefits**:
   - Vercel automatically handles apex domain via ALIAS
   - No manual DNS record management
   - No conflicts with Squarespace
   - Automatic SSL certificates

---

## After Making Changes

### Step 5: Verify DNS Records

**Your Vercel dashboard should show** (after removing A record):
```
✅ www          CNAME    88777c230be8011f.vercel-dns-017.com.    60
✅ @ (apex)     ALIAS    88777c230be8011f.vercel-dns-017.com    60    (Auto-managed)
✅ *            ALIAS    cname.vercel-dns-017.com.              60    (Auto-managed)
✅ CAA          0 issue "letsencrypt.org"                       60
❌ A record     (REMOVED - was causing conflict)
```

### Step 6: Wait for DNS Propagation

1. **Wait 5-15 minutes** after making changes
2. **Check DNS propagation**:
   - Go to: https://dnschecker.org
   - Enter: `universalaiservices.com`
   - Check A records
   - Should show Vercel's IPs, NOT Squarespace IPs

3. **Test your domain**:
   - Visit: `http://universalaiservices.com`
   - Visit: `https://universalaiservices.com`
   - Should show your Vercel site, not Squarespace

### Step 7: Clear Caches

**Clear DNS cache**:
```bash
# Mac
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns

# Then try incognito/private browsing
```

---

## Summary Checklist

- [ ] **Remove A record `216.198.79.1` from Vercel**
- [ ] **Disconnect domain from Squarespace** (remove from Squarespace dashboard)
- [ ] **Remove Squarespace DNS records** at domain registrar
- [ ] **Remove A record `198.49.23.144`** if it exists at registrar
- [ ] **Use Vercel nameservers** (recommended) OR keep only Vercel DNS records
- [ ] **Wait 5-15 minutes** for DNS propagation
- [ ] **Test** `universalaiservices.com` in browser
- [ ] **Verify** it shows Vercel site, not Squarespace

---

## Why This Happens

1. **Squarespace connection**: Squarespace still thinks it owns the domain
2. **Conflicting A record**: The A record in Vercel conflicts with ALIAS records
3. **Registrar DNS**: Old DNS records at registrar might still point to Squarespace

**Solution**: Remove all Squarespace connections and let Vercel's ALIAS records handle everything automatically.

---

## If Still Not Working

**Check these**:

1. **DNS Checker**: https://dnschecker.org
   - What IP addresses does it show for `universalaiservices.com`?
   - Should be Vercel IPs, not `198.49.23.144` or `216.198.79.1`

2. **Domain Registrar**:
   - Are there any A records for apex domain?
   - Are nameservers pointing to Vercel or registrar?

3. **Squarespace**:
   - Is domain completely removed from Squarespace?
   - Check if it's still listed anywhere

4. **Wait longer**:
   - DNS can take 24-48 hours to fully propagate
   - Check from multiple locations using DNS checker tools

---

## Quick Action Items

**Do these NOW**:

1. ✅ **Delete A record `216.198.79.1`** in Vercel dashboard
2. ✅ **Disconnect domain** from Squarespace completely
3. ✅ **Remove Squarespace DNS records** at your domain registrar
4. ✅ **Use Vercel nameservers** (easiest solution)

After these steps, wait 10-15 minutes and test your domain!

