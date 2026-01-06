# Update Nameservers in Squarespace to Vercel

## Overview

You purchased your domain on Squarespace, and now you want to use Vercel's nameservers so Vercel can manage your DNS automatically.

**Vercel Nameservers**:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

---

## Step-by-Step: Update Nameservers in Squarespace

### Step 1: Access Nameserver Settings

1. **Log into Squarespace**: https://account.squarespace.com
2. **Go to your domain settings**:
   - Navigate to your site settings
   - Find **Domains** or **Domain Settings**
   - Click on `universalaiservices.com`

### Step 2: Switch to Custom Nameservers

1. **Find "Nameservers" section**
2. **Select "Use custom nameservers"** (or similar option)
   - You might see "Use Squarespace nameservers" currently selected
   - Switch to custom/custom nameservers option

### Step 3: Enter Vercel Nameservers

**Enter these two nameservers**:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Important**: 
- You need at least 2 nameservers (Squarespace requires this)
- Enter them exactly as shown above
- Make sure there are no typos

### Step 4: Save Changes

1. **Click "Update Nameservers"** button
2. **Confirm** the change if prompted
3. **Wait for confirmation** that nameservers have been updated

---

## What Happens After Updating

### Immediate Changes

1. **DNS management moves to Vercel**
   - Squarespace will no longer manage DNS records
   - Vercel will automatically manage all DNS records
   - This includes A records, CNAME records, ALIAS records, etc.

2. **Propagation time**: 24-48 hours
   - Nameserver changes take longer than DNS record changes
   - Can take up to 48 hours to propagate globally
   - Your site should continue working during this time

### After Propagation

1. **Vercel manages everything automatically**:
   - Apex domain (`universalaiservices.com`)
   - WWW subdomain (`www.universalaiservices.com`)
   - SSL certificates
   - All DNS records

2. **No manual DNS management needed**:
   - You won't need to manually add/update DNS records
   - Vercel handles it all automatically
   - DNS updates happen automatically when you deploy

---

## Important Notes

### ⚠️ Squarespace Warning

Squarespace mentioned: *"Certain domain features won't be available when using custom nameservers"*

**What this means**:
- You won't be able to manage DNS records in Squarespace anymore
- Some Squarespace-specific domain features may be unavailable
- **This is fine** - you're using Vercel for hosting, so you want Vercel to manage DNS

### ✅ Benefits of Using Vercel Nameservers

1. **Automatic DNS management**
   - Vercel handles all DNS records automatically
   - No manual configuration needed
   - Updates happen automatically

2. **Better integration**
   - DNS changes sync with deployments
   - Automatic SSL certificate management
   - Easier to manage multiple domains

3. **No conflicts**
   - No more Squarespace DNS conflicts
   - Clean DNS setup
   - Everything managed in one place (Vercel)

---

## Verify Nameserver Update

### Step 1: Check Nameservers

**Use nameserver lookup tools**:
- https://mxtoolbox.com/SuperTool.aspx?action=ns%3auniversalaiservices.com
- https://www.whatsmydns.net/#NS/universalaiservices.com

**Expected Result**: Should show:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

### Step 2: Wait for Propagation

**Check from multiple locations**:
- DNS propagation can take 24-48 hours
- Different locations may show different results initially
- Wait until all locations show Vercel nameservers

### Step 3: Verify Domain Works

1. **Visit**: `http://universalaiservices.com`
2. **Visit**: `https://universalaiservices.com`
3. **Both should work** and show your Vercel site

---

## Troubleshooting

### Issue: Nameservers Not Updating

**Solution**:
1. Double-check you entered nameservers correctly
2. Make sure you clicked "Update Nameservers" and confirmed
3. Wait 24-48 hours for propagation
4. Check with nameserver lookup tools

### Issue: Site Not Working After Update

**Solution**:
1. **Wait longer** - nameserver changes take time
2. **Check Vercel Dashboard**:
   - Go to Settings → Domains
   - Verify `universalaiservices.com` is listed
   - Check if it shows "Valid Configuration"

3. **Clear DNS cache**:
   ```bash
   # Mac
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   
   # Windows
   ipconfig /flushdns
   ```

### Issue: Still Seeing Squarespace Site

**Solution**:
1. This is normal during propagation
2. Different locations may see different results
3. Wait 24-48 hours for full propagation
4. Use incognito/private browsing to test

---

## After Nameservers Are Updated

### In Vercel Dashboard

Once nameservers propagate, you'll see in Vercel:
- Domain shows as "Valid Configuration"
- DNS records managed automatically
- SSL certificate active
- No manual DNS configuration needed

### You Can Remove Old DNS Records

**In Squarespace** (if you still have access):
- You can remove old DNS records
- They won't matter anymore since Vercel manages DNS
- But it's fine to leave them - they'll be ignored

---

## Quick Checklist

- [ ] Log into Squarespace
- [ ] Go to Domain Settings for `universalaiservices.com`
- [ ] Find Nameservers section
- [ ] Switch to "Use custom nameservers"
- [ ] Enter `ns1.vercel-dns.com`
- [ ] Enter `ns2.vercel-dns.com`
- [ ] Click "Update Nameservers"
- [ ] Confirm the change
- [ ] Wait 24-48 hours for propagation
- [ ] Verify with nameserver lookup tools
- [ ] Test `universalaiservices.com` in browser

---

## Summary

**What you're doing**: Changing nameservers from Squarespace to Vercel

**Why**: So Vercel can automatically manage all DNS records

**How**: Update nameservers in Squarespace domain settings

**When**: Anytime - your site will continue working during the transition

**Time**: 24-48 hours for full propagation

**Result**: Vercel manages DNS automatically, no manual configuration needed!

---

## Need Help?

- **Vercel DNS Docs**: https://vercel.com/docs/concepts/projects/domains
- **Squarespace Support**: If you have issues updating nameservers in Squarespace
- **DNS Checker**: https://dnschecker.org (to verify propagation)


