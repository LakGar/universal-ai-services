# Vercel DNS Update - New IP Address

## Vercel Recommendation

Vercel recommends updating your DNS records to use their new IP address as part of their IP range expansion:

**New A Record**:
- **Type**: A
- **Name**: `@` (or blank for apex domain)
- **Value**: `216.150.1.1`

**Note**: The old records (`cname.vercel-dns.com` and `76.76.21.21`) will continue to work, but Vercel recommends using the new IP.

---

## How to Update DNS Record

### Step 1: Go to Your Domain Registrar

Where did you buy `universalaiservices.com`?
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- Other

### Step 2: Access DNS Management

1. **Log into your domain registrar**
2. **Go to DNS Management** (might be called):
   - DNS Settings
   - DNS Records
   - Advanced DNS
   - Name Servers

### Step 3: Update A Record for Apex Domain

**Find the existing A record** for the apex domain (`@` or blank name):

**Current A Record** (if exists):
```
Type: A
Name: @ (or blank)
Value: 76.76.21.21 (old IP)
```

**Update to**:
```
Type: A
Name: @ (or blank)
Value: 216.150.1.1 (new IP from Vercel)
TTL: 60 (or default)
```

### Step 4: Save Changes

1. **Click "Save"** or "Apply Changes"
2. **Wait for DNS propagation** (5-15 minutes typically)

---

## If Using Vercel Nameservers

**If you're using Vercel nameservers** (recommended):
- Vercel manages DNS automatically
- You don't need to manually update A records
- Vercel will handle the IP update automatically
- Just wait for propagation

**To check if you're using Vercel nameservers**:
1. Go to your domain registrar
2. Check "Nameservers" or "DNS" settings
3. If they show Vercel nameservers (like `ns1.vercel-dns.com`), you're all set
4. Vercel will handle the update automatically

---

## Verify DNS Update

### Step 1: Check DNS Propagation

**Use DNS checker tools**:
- https://dnschecker.org
- Enter: `universalaiservices.com`
- Select record type: **A**
- Check results from multiple locations

**Expected Result**: Should show `216.150.1.1` (new IP)

### Step 2: Test Your Domain

1. **Wait 5-15 minutes** after making changes
2. **Visit**: `http://universalaiservices.com`
3. **Visit**: `https://universalaiservices.com`
4. **Both should work** and show your Vercel site

### Step 3: Clear DNS Cache (if needed)

If you still see old results:

```bash
# Mac
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches
```

Then try **incognito/private browsing** mode.

---

## Current DNS Records (After Update)

Your DNS records should look like:

```
✅ www          CNAME    88777c230be8011f.vercel-dns-017.com.    60
✅ @ (apex)     A        216.150.1.1                             60    (NEW IP)
✅ ALIAS        (Auto-managed by Vercel if using Vercel nameservers)
✅ CAA          0 issue "letsencrypt.org"                       60
```

---

## Important Notes

1. **Old records still work**: The old IP (`76.76.21.21`) will continue to work, but Vercel recommends updating
2. **Propagation time**: DNS changes can take 5-15 minutes to propagate globally
3. **No downtime**: This update shouldn't cause any downtime
4. **Automatic if using Vercel nameservers**: If you're using Vercel nameservers, they handle this automatically

---

## Quick Checklist

- [ ] Log into domain registrar
- [ ] Go to DNS Management
- [ ] Find A record for apex domain (`@`)
- [ ] Update IP from `76.76.21.21` to `216.150.1.1`
- [ ] Save changes
- [ ] Wait 5-15 minutes
- [ ] Verify with DNS checker: https://dnschecker.org
- [ ] Test `universalaiservices.com` in browser

---

## Need Help?

- **Vercel DNS Docs**: https://vercel.com/docs/concepts/projects/domains
- **Vercel Support**: Check Vercel dashboard support section
- **DNS Checker**: https://dnschecker.org

---

## Summary

**What to do**: Update the A record for `universalaiservices.com` to use IP `216.150.1.1` instead of the old IP.

**Where**: At your domain registrar's DNS management panel.

**When**: Anytime (old IP still works, but update when convenient).

**Why**: Part of Vercel's IP range expansion - recommended for future compatibility.


