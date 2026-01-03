# How to Add Google Drive Images to Your Products

## Option 1: Add Direct Image URLs to JSON (Recommended)

Add an `"Images"` field to each product in your JSON file with an array of image URLs:

```json
{
  "Model Name": "Unitree Go2 Pro",
  "Images": [
    "https://drive.google.com/uc?export=view&id=YOUR_FILE_ID_1",
    "https://drive.google.com/uc?export=view&id=YOUR_FILE_ID_2",
    "https://drive.google.com/uc?export=view&id=YOUR_FILE_ID_3"
  ],
  ...
}
```

### How to Get Google Drive Image URLs:

1. **For Individual Files:**
   - Open your Google Drive file
   - Right-click → "Get link" → Make sure it's set to "Anyone with the link can view"
   - Copy the link (format: `https://drive.google.com/file/d/FILE_ID/view`)
   - Extract the FILE_ID from the URL
   - Use this format: `https://drive.google.com/uc?export=view&id=FILE_ID`

2. **For Multiple Images in a Folder:**
   - Open each image file individually
   - Get the file ID from each file's sharing link
   - Add all file IDs to the `Images` array in your JSON

## Option 2: Convert Google Drive Folder Links

If you have folder links in your `Location ID` field, you need to:

1. Open the Google Drive folder
2. For each image file in the folder:
   - Right-click → "Get link" → Set to "Anyone with the link can view"
   - Extract the file ID from the URL
   - Add the direct image URL to the `Images` field

## Example JSON Entry:

```json
{
  "Category": "Buy",
  "Model Name": "Unitree Go2 Pro",
  "Product ID": "GO2-PRO-0001",
  "Images": [
    "https://drive.google.com/uc?export=view&id=1ABC123xyz",
    "https://drive.google.com/uc?export=view&id=1DEF456uvw",
    "https://drive.google.com/uc?export=view&id=1GHI789rst"
  ],
  "Location ID": "https://drive.google.com/drive/folders/1JbTM7VSlnA6bwJcR4hA-FiDDQ__cmI74?usp=sharing",
  ...
}
```

## Quick Steps:

1. **Open your Google Drive folder** with product images
2. **For each product:**
   - Open each image file
   - Get the sharing link (make sure it's public)
   - Extract the file ID (the long string between `/d/` and `/view`)
   - Add to JSON: `"https://drive.google.com/uc?export=view&id=FILE_ID"`
3. **Add the `Images` array** to each product in `buy_data.json`
4. **Save the file** - the images will automatically load!

## Notes:

- Make sure all images are set to "Anyone with the link can view" in Google Drive
- The first image in the array will be used as the main product image
- You can add multiple images for the product detail gallery
- If `Images` field is not provided, the code will try to extract from `Location ID`, otherwise use placeholders




