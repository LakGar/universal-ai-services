# Domain DNS Setup Guide - Fixing Apex Domain Issue

## Problem

- ✅ `www.universalaiservices.com` → Works (shows your new website)
- ❌ `universalaiservices.com` → Still shows Squarespace website

## Why This Happens

When you change nameservers, the apex domain (non-www) needs special configuration because:

- **Apex domains** (`example.com`) can only use **A records** or **ALIAS records**
- **Subdomains** (`www.example.com`) can use **CNAME records**
- Squarespace might still have DNS records cached or configured

---

## Solution: Configure Apex Domain in Your Hosting Provider

### If Using Vercel (Most Common for Next.js)

1. **Go to Vercel Dashboard**:

   - https://vercel.com/dashboard
   - Select your project

2. **Add Domain**:

   - Go to **Settings** → **Domains**
   - Add both domains:
     - `universalaiservices.com` (apex domain)
     - `www.universalaiservices.com` (already working)

3. **Configure DNS Records**:
   Vercel will show you DNS records to add. You need to add these at your domain registrar:

   **For Apex Domain (`universalaiservices.com`)**:

   - **Type**: `A` record
   - **Name**: `@` or leave blank (depends on registrar)
   - **Value**: Vercel's IP addresses (they'll provide 2-4 IPs)
   - **TTL**: 3600 (or default)

   **For WWW (`www.universalaiservices.com`)**:

   - **Type**: `CNAME` record
   - **Name**: `www`
   - **Value**: `cname.vercel-dns.com` (or what Vercel provides)
   - **TTL**: 3600 (or default)

4. **Alternative: Use ALIAS/ANAME Record** (if your registrar supports it):
   - Some registrars support ALIAS/ANAME records for apex domains
   - This allows you to point apex to a CNAME target
   - Check if your registrar supports this

---

### If Using Other Hosting Providers

**Netlify**:

- Go to **Site settings** → **Domain management**
- Add `universalaiservices.com` as custom domain
- Follow DNS instructions (usually A records)

**Cloudflare**:

- Add domain to Cloudflare
- Use **DNS** → **Records**
- Add A record for apex domain pointing to hosting IP
- Add CNAME for www

**Other Providers**:

- Check your hosting provider's documentation for apex domain setup
- Usually requires A records pointing to their IP addresses

---

## Step-by-Step: Fix DNS at Your Domain Registrar

### 1. Log into Your Domain Registrar

Where did you buy `universalaiservices.com`?

- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- Other

### 2. Find DNS Management

Look for:

- **DNS Management**
- **DNS Settings**
- **Name Servers**
- **DNS Records**

### 3. Remove Old Squarespace Records

**Delete these if they exist**:

- Any A records pointing to Squarespace IPs
- Any CNAME records pointing to Squarespace
- Any ALIAS records for Squarespace

**Common Squarespace Records to Remove**:

```
Type: A
Name: @
Value: 198.185.159.145 (or similar Squarespace IP)
```

### 4. Add New DNS Records

**For Apex Domain (`universalaiservices.com`)**:

**Option A: A Records** (if your hosting provider gives you IPs):

```
Type: A
Name: @ (or leave blank)
Value: [Your hosting provider's IP address]
TTL: 3600
```

**Option B: ALIAS/ANAME Record** (if supported):

```
Type: ALIAS (or ANAME)
Name: @
Value: [Your hosting provider's CNAME target]
TTL: 3600
```

**For WWW Subdomain** (should already be working):

```
Type: CNAME
Name: www
Value: [Your hosting provider's CNAME target]
TTL: 3600
```

---

## Quick Fix: Redirect Apex to WWW

If you can't configure the apex domain properly, you can redirect it:

### Option 1: Redirect at Registrar Level

Many registrars offer URL forwarding/redirects:

- Set `universalaiservices.com` → redirect to `www.universalaiservices.com`
- This is a temporary solution but works immediately

### Option 2: Redirect in Next.js

Add redirect in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "universalaiservices.com",
          },
        ],
        destination: "https://www.universalaiservices.com",
        permanent: true,
      },
    ];
  },
  // ... rest of config
};
```

**Note**: This only works if the domain is already pointing to your server. You still need DNS configured.

---

## Verify DNS Configuration

### 1. Check Current DNS Records

Use online tools to check:

- **DNS Checker**: https://dnschecker.org
- **MXToolbox**: https://mxtoolbox.com/DNSLookup.aspx
- **What's My DNS**: https://www.whatsmydns.net

Enter `universalaiservices.com` and check:

- A records should point to your hosting provider
- No Squarespace IPs should appear

### 2. Check Propagation

DNS changes can take 24-48 hours to propagate:

- Use DNS checker tools above
- Check from multiple locations
- Wait for all locations to show new records

### 3. Test Your Domain

After DNS propagates:

- Visit `http://universalaiservices.com` (should work)
- Visit `https://universalaiservices.com` (should work)
- Both should show your new website, not Squarespace

---

## Common Issues & Solutions

### Issue: Still Showing Squarespace After 48 Hours

**Solution**:

1. Clear browser cache
2. Try incognito/private browsing
3. Check DNS records are correct
4. Verify nameservers are pointing to your new hosting provider

### Issue: Nameservers Not Changed

**Solution**:

1. Go to domain registrar
2. Change nameservers to your hosting provider's nameservers
3. Wait 24-48 hours for propagation

### Issue: SSL Certificate Not Working

**Solution**:

1. Your hosting provider should auto-generate SSL certificates
2. Wait for DNS to fully propagate
3. SSL certificates usually generate automatically after DNS is correct

### Issue: Can't Add A Records

**Solution**:

- Some registrars don't allow A records if nameservers are changed
- You need to manage DNS where your nameservers point
- If using Vercel nameservers, manage DNS in Vercel
- If using Cloudflare nameservers, manage DNS in Cloudflare

---

## Recommended Setup

### Best Practice: Use WWW as Primary

Many sites redirect apex to www:

- `universalaiservices.com` → redirects to → `www.universalaiservices.com`
- This is easier to manage and more flexible

### Complete DNS Setup

**At Your Hosting Provider** (e.g., Vercel):

1. Add `universalaiservices.com` (apex)
2. Add `www.universalaiservices.com` (www)
3. Get DNS records to add

**At Your Domain Registrar**:

1. Point nameservers to hosting provider (if not already done)
2. Add A record for apex domain
3. Add CNAME for www (if not managed by nameservers)

---

## Need Help?

### Check Your Hosting Provider Docs

- **Vercel**: https://vercel.com/docs/concepts/projects/domains
- **Netlify**: https://docs.netlify.com/domains-https/custom-domains/
- **Cloudflare**: https://developers.cloudflare.com/dns/

### Contact Support

- Your hosting provider's support
- Your domain registrar's support
- They can help configure DNS correctly

---

## Summary Checklist

- [ ] Identified your hosting provider (Vercel, Netlify, etc.)
- [ ] Added `universalaiservices.com` as domain in hosting provider
- [ ] Got DNS records from hosting provider
- [ ] Removed old Squarespace DNS records
- [ ] Added A record for apex domain (`@` or blank name)
- [ ] Verified CNAME for www is correct
- [ ] Waited 24-48 hours for DNS propagation
- [ ] Tested `universalaiservices.com` (should work)
- [ ] Verified SSL certificate is active
- [ ] Both `www` and apex domain work correctly

---

## Quick Test

After making changes, test with:

```bash
# Check DNS records
nslookup universalaiservices.com
nslookup www.universalaiservices.com

# Check from browser
# Visit: http://universalaiservices.com
# Should show your website, not Squarespace
```
