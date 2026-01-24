
import { Product } from '../types';

function getPlainTextDescription(html: string): string {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  const firstP = div.querySelector('p');
  let text = firstP ? firstP.textContent || '' : div.textContent || '';
  text = text.replace(/\s+/g, ' ').trim();
  if (text.length > 150) text = text.substring(0, 150).trim() + '...';
  return text;
}

function extractTagsFromHtml(html: string): string[] {
  if (!html) return [];
  const div = document.createElement('div');
  div.innerHTML = html;
  return Array.from(div.querySelectorAll('img'))
    .map(img => img.alt)
    .filter(alt => alt && !alt.toLowerCase().includes('generated') && alt.length < 20)
    .slice(0, 3);
}

function extractImagesFromHtml(html: string): string[] {
  if (!html) return [];
  const div = document.createElement('div');
  div.innerHTML = html;
  return Array.from(div.querySelectorAll('img'))
    .map(img => img.src)
    .filter(src => src && src.startsWith('http'));
}

export const parseProductsFromCsv = (csvString: string): Product[] => {
  const productsMap = new Map<string, Product>();
  const rows: string[][] = [];
  
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuote = false;
  
  const cleanCsv = csvString ? csvString.trim() : '';
  for (let i = 0; i < cleanCsv.length; i++) {
    const char = cleanCsv[i];
    if (inQuote) {
      if (char === '"') {
        if (i + 1 < cleanCsv.length && cleanCsv[i + 1] === '"') {
          currentVal += '"';
          i++; 
        } else {
          inQuote = false;
        }
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ',') {
        currentRow.push(currentVal);
        currentVal = '';
      } else if (char === '\n') {
        currentRow.push(currentVal);
        rows.push(currentRow);
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
  }
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal);
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim().replace(/^"|"$/g, ''));
  const getIdx = (name: string) => headers.indexOf(name);
  
  const idxHandle = getIdx('Handle');
  const idxTitle = getIdx('Title');
  const idxBody = getIdx('Body (HTML)');
  const idxPrice = getIdx('Variant Price');
  const idxSku = getIdx('Variant SKU');
  const idxImage = getIdx('Image Src');
  const idxCategory = getIdx('Product Category');

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < headers.length) continue;

    const handle = row[idxHandle];
    if (!handle) continue;

    if (!productsMap.has(handle)) {
      const fullHtmlBody = row[idxBody] || '';
      const htmlImages = extractImagesFromHtml(fullHtmlBody);
      const primaryImage = row[idxImage];
      
      const newProduct: Product = {
        handle: handle,
        title: row[idxTitle],
        price: row[idxPrice] || '0.00',
        sku: row[idxSku],
        image: primaryImage,
        category: row[idxCategory] || 'Optimization',
        description: getPlainTextDescription(fullHtmlBody),
        bodyHtml: fullHtmlBody,
        tags: extractTagsFromHtml(fullHtmlBody),
        // Custom field for gallery
        gallery: [primaryImage, ...htmlImages].filter((v, i, a) => v && a.indexOf(v) === i)
      };
      productsMap.set(handle, newProduct);
    } else {
      const existingProduct = productsMap.get(handle)!;
      const img = row[idxImage];
      // Updated: removed @ts-ignore and added safety check for gallery
      if (img && existingProduct.gallery && !existingProduct.gallery.includes(img)) {
        existingProduct.gallery.push(img);
      }
    }
  }

  return Array.from(productsMap.values()).filter(product => product.title && parseFloat(product.price) > 0);
};

export const rawCsvData = `Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option1 Linked To,Option2 Name,Option2 Value,Option2 Linked To,Option3 Name,Option3 Value,Option3 Linked To,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,description_generated (product.metafields.amasty.description_generated),seo_description_generated (product.metafields.amasty.seo_description_generated),seo_title_generated (product.metafields.amasty.seo_title_generated),title_generated (product.metafields.amasty.title_generated),Google: Custom Product (product.metafields.mm-google-shopping.custom_product),Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Status
5-htp,5-HTP,"<p>5-HTP occurs naturally in the body. Typically, people produce enough for regular functioning, but some require supplementation. 5-HTP dietary supplements aid in supporting normal serotonin levels in the brain and emotional well-being. </p><p><br></p><p>Since 5-HTP is naturally present in the body, supplementing with it is a clean, holistic way to support normal serotonin levels.* </p><p><br></p><p><strong>Ingredients: </strong>Calcium (as Calcium Carbonate), 5-Hydroxytryptophan (from Griffo via simplicifolia seed extract), Gelatin (capsule), Magnesium Stearate. </p><p><strong>Manufacturer Country</strong>: USA</p><p><strong>Product Amount</strong>: 60 caps</p><p><strong>Gross Weight: </strong>0.25lb (113g)</p><p><strong style=""color: rgb(0, 0, 0);"">Suggested Use:</strong><span style=""color: rgb(0, 0, 0);""> Take two (2) capsules once a day as a dietary supplement. For best results, take 20-30 min before a meal with an 8oz (236 ml) glass of water or as directed by your healthcare professional.</span></p><p><strong>Caution: </strong>Do not exceed recommended dose. Pregnant or nursing mothers, children under the age of 18, and individuals with a known medical condition should consult a physician before using this or any dietary supplement.</p><p><strong>Warning:</strong> Keep out of reach of children. Do not use if the safety seal is damaged or missing. Store in a cool, dry place.</p><p><br></p><p><strong>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</strong></p> <p>
          <img src=""https://storage.googleapis.com/supliful/categories/images/20221206094907-gluten-free-2x.png"" alt=""Gluten-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://storage.googleapis.com/supliful/categories/images/20221206095432-lactose-free-2x.png"" alt=""Lactose-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://storage.googleapis.com/supliful/categories/images/20221206095601-allergen-free-2x.png"" alt=""Allergen-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://storage.googleapis.com/supliful/categories/images/20221206095715-hormone-free-2x.png"" alt=""Hormone-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://storage.googleapis.com/supliful/categories/images/20221206100008-100--natural-2x.png"" alt=""All natural"" style=""height: 6rem; width: auto;"">
          <img src=""https://storage.googleapis.com/supliful/categories/images/20221206100059-antibiotic-free-2x.png"" alt=""Antibiotic-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://storage.googleapis.com/supliful/categories/images/20221206101002-corn-free-2x.png"" alt=""Corn-free"" style=""height: 6rem; width: auto;""></p>",Hello Healthy store,,Amino Acids & Blends,,true,Title,Default Title,,,,,,,,VOX45HTP,113.3980925,,continue,manual,19.90,,true,true,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044019636-generated-label-image-0.jpg?v=1758045639,1,,false,,,,,,,,,,,,,,,,,,,,lb,,9.79,active
5-htp,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044019637-generated-label-image-2.jpg?v=1758045639,2,,,,,,,,,,,,,,,,,,,,,,,,,
5-htp,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044019636-generated-label-image-1.jpg?v=1758045639,3,,,,,,,,,,,,,,,,,,,,,,,,,
5-htp,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044019638-generated-label-image-3.jpg?v=1758045639,4,,,,,,,,,,,,,,,,,,,,,,,,,
5-htp,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044019639-generated-label-image-4.jpg?v=1758045639,5,,,,,,,,,,,,,,,,,,,,,,,,,
5-htp,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/20250617184915-vox45htp-sf.png?v=1758045639,6,,,,,,,,,,,,,,,,,,,,,,,,,
advanced-100-whey-protein-isolate-chocolate,Advanced 100% Whey Protein Isolate (Chocolate),"<body>




    
    <p>
        Indulge in the sumptuous taste of <strong>Advanced 100% Whey Protein Isolate (Chocolate)</strong>. This premium protein supplement is specially formulated to provide your body with top-tier protein that supports muscle development and recovery. With its delightful chocolate flavor, it’s perfect for athletes and fitness aficionados seeking a delicious post-workout shake or a nutritious protein hit throughout the day.
    </p>
    <h2>Health Benefits:</h2>
    <ul>
        <li>
<strong>High-Quality Protein:</strong> Each serving offers 22g of pure whey protein isolate to facilitate muscle recovery and growth.</li>
        <li>
<strong>Decadent Chocolate Flavor:</strong> Savor the rich, chocolatey goodness with every scoop.</li>
        <li>
<strong>Versatile Usage:</strong> Perfect as a post-workout shake or for a protein boost any time of the day.</li>
        <li>
<strong>Digestive Health:</strong> Infused with apple pectin powder for optimal digestive support.</li>
        <li>
<strong>Healthy Fats:</strong> Features MCT oil powder for rapid energy and improved metabolism.</li>
    </ul>
    <h2>Ingredients:</h2>
    <p>
        Whey Protein Isolate, Cocoa Powder, MCT Oil Powder, Natural Flavors, Sunflower Lecithin, Apple Pectin Powder, Sea Salt, Stevia Extract, Silicon Dioxide.
    </p>
    <h2>Suggested Use:</h2>
    <p>
        As a dietary supplement, adults should mix two (2) scoops with 6-8 oz. of water or your preferred beverage daily. For optimal results, consume 20-30 minutes before a meal with 8 oz. of water or as directed by a healthcare professional.
    </p>
    <h2>Country of Manufacture:</h2>
    <p>USA</p>
    <h2>Product Amount:</h2>
    <p>29.60 oz. (839 g)</p>
    <h2>Warning:</h2>
    <p>Do not exceed the recommended dosage.</p>


<p><img src=""https://supliful.s3.amazonaws.com/categories/images/20221206124537-vegetarian.png"" alt=""Vegetarian"" style=""height: 6rem; width: auto;""></p>
<p><img src=""https://supliful.s3.amazonaws.com/categories/images/20221206100927-non-gmo-2x.png"" alt=""Non-GMO"" style=""height: 6rem; width: auto;""></p>
</body>",Hello Healthy store,,Proteins & Blends,,true,Title,Default Title,,,,,,,,JTP7ADWC,907.18474,,continue,manual,49.90,,true,true,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044351820-generated-label-image-0.jpg?v=1758045651,1,,false,,,,,,,,,,,,,,TRUE,,,,,,lb,,27.75,active
advanced-100-whey-protein-isolate-chocolate,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044351821-generated-label-image-1.jpg?v=1758045651,2,,,,,,,,,,,,,,,,,,,,,,,,,
advanced-100-whey-protein-isolate-chocolate,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044351824-generated-label-image-3.jpg?v=1758045652,3,,,,,,,,,,,,,,,,,,,,,,,,,
advanced-100-whey-protein-isolate-chocolate,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044351822-generated-label-image-2.jpg?v=1758045651,4,,,,,,,,,,,,,,,,,,,,,,,,,
advanced-100-whey-protein-isolate-chocolate,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/20250617131029-jtp7adwc-sf.png?v=1758045651,5,,,,,,,,,,,,,,,,,,,,,,,,,
alpha-energy,Alpha Energy,"<p>Support Men's Vitality and Wellness: Our carefully crafted dietary supplement is designed to promote men's health and well-being without containing testosterone. Formulated with a blend of key nutrients including magnesium, zinc, tribulus terrestris, chysin, horny goat weed, longjack, saw palmetto berries, hawthorn berries, and cissus quadrangularis, our product supports various aspects of men's health. * </p><p><br></p><p><strong>Muscle Support and Energy Boost</strong>: Enhance lean muscle mass and energy levels with our supplement, which is thought to support muscle growth and weight management. * </p><p><br></p><p><strong>Heart Health</strong>: Support cardiovascular wellness with nutrients that aid in red blood cell production and promote healthy blood flow for optimal heart function. * </p><p><br></p><p><strong>Bone Strength and Density</strong>: Maintain bone density and strength with this formula. * </p><p><br></p><p><strong>Enhanced Vitality</strong>: Promote a healthy libido and sexual function, which may support sexual activity and overall vitality. </p><p><br></p><p>Experience comprehensive support for men's health and vitality with this scientifically formulated dietary supplement.</p><p><br></p><p><strong>Ingredients: </strong>Magnesium (as Magnesium Oxide), Zinc (as Zinc Oxide), Tribulus Terrestris (fruit), Chrysin (seed), Horny Goat Weed (aerial), Longjack (root), Saw palmetto Berries, Hawthorn Berries, Cissus Quadrangularis (stem), Cellulose (vegetable capsule), Rice Flour, Magnesium Stearate.</p><p><strong>Manufacturer Country:</strong> USA</p><p><strong>Product Amount: </strong>90 caps</p><p><strong>Gross Weight: </strong> 0.14lb (65g)</p><p><strong>Suggested Use:</strong> Take three (3) capsules before bedtime.</p><p><strong>Warning</strong>: Consult with a physician before use if you have any medical conditions. Do not use if pregnant or lactating.</p><p><br></p><p><strong>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</strong></p> <p>
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206094907-gluten-free-2x.png"" alt=""Gluten-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206124537-vegetarian.png"" alt=""Vegetarian"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206095432-lactose-free-2x.png"" alt=""Lactose-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206095601-allergen-free-2x.png"" alt=""Allergen-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206095715-hormone-free-2x.png"" alt=""Hormone-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206100008-100--natural-2x.png"" alt=""All natural"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206124358-vegan.png"" alt=""Vegan friendly"" style=""height: 6rem; width: auto;""></p>",Hello Healthy store,,Specialty Supplements,,true,Title,Default Title,,,,,,,,VOX4TEST,63.5029318,,continue,manual,40.90,,true,true,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044108339-generated-label-image-0.jpg?v=1758045643,1,,false,,,,,,,,,,,,,,,,,,,,lb,,10.75,active
alpha-energy,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044108340-generated-label-image-1.jpg?v=1758045643,2,,,,,,,,,,,,,,,,,,,,,,,,,
alpha-energy,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044108342-generated-label-image-2.jpg?v=1758045643,3,,,,,,,,,,,,,,,,,,,,,,,,,
alpha-energy,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044108344-generated-label-image-3.jpg?v=1758045643,4,,,,,,,,,,,,,,,,,,,,,,,,,
alpha-energy,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044108345-generated-label-image-4.jpg?v=1758045643,5,,,,,,,,,,,,,,,,,,,,,,,,,
alpha-energy,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/20250618124324-vox4test-sf.png?v=1758045643,6,,,,,,,,,,,,,,,,,,,,,,,,,
ashwagandha,Ashwagandha,"<p>Ashwagandha is an ancient herb used in Ayurvedic medicine, India’s traditional healthcare system. Recently popularized worldwide, it’s most well-known as a powerful adaptogen that helps individuals calm their stress levels. *</p><p><br></p><p>Ashwagandha contains potent chemicals that help to support overall health in the body.*</p><p><br></p><p><strong>Ingredients: </strong>Organic Ashwagandha (Withania somnifera)(root), Organic Black Pepper (Piper nigrum)(fruit), pullulan capsules.</p><p><strong>Manufacturer Country</strong>: USA</p><p><strong>Amount</strong>: 60 caps</p><p><strong>Gross Weight: </strong>0.25lb (113g)</p><p><strong style=""color: rgb(0, 0, 0);"">Suggested Use:</strong><span style=""color: rgb(0, 0, 0);""> Take one (1) capsule twice a day as a dietary supplement. For best results, take 20-30 min before a meal with an 8oz glass of water or as directed by your healthcare professional.</span></p><p><strong>Caution: </strong>Do not exceed recommended dose. Pregnant or nursing mothers, children under the age of 18, and individuals with a known medical condition should consult a physician before using this or any dietary supplement.</p><p><strong>Warning:</strong> This product is not intended to diagnose, treat, cure or prevent any disease. Keep out of reach of children. Do not use if the safety seal is damaged or missing. Store in a cool, dry place.</p><p><br></p><p><strong>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.</strong></p> <p>
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206094907-gluten-free-2x.png"" alt=""Gluten-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206124537-vegetarian.png"" alt=""Vegetarian"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206095432-lactose-free-2x.png"" alt=""Lactose-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206095601-allergen-free-2x.png"" alt=""Allergen-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206095715-hormone-free-2x.png"" alt=""Hormone-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206100008-100--natural-2x.png"" alt=""All natural"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206100059-antibiotic-free-2x.png"" alt=""Antibiotic-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206101002-corn-free-2x.png"" alt=""Corn-free"" style=""height: 6rem; width: auto;"">
          <img src=""https://supliful.s3.amazonaws.com/categories/images/20221206124358-vegan.png"" alt=""Vegan friendly"" style=""height: 6rem; width: auto;""></p>",Hello Healthy store,,Natural Extracts,,true,Title,Default Title,,,,,,,,VOX4ASHW,113.3980925,,continue,manual,23.90,,true,true,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044025355-generated-label-image-0.jpg?v=1758045639,1,,false,,,,,,,,,,,,,,,,,,,,lb,,7.59,active
ashwagandha,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044025430-generated-label-image-4.jpg?v=1758045639,2,,,,label-image-1.jpg?v=1758045639,3,,,,,,,,,,,,,,,,,,,,,,,,,
ashwagandha,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044025425-generated-label-image-2.jpg?v=1758045639,4,,,,,,,,,,,,,,,,,,,,,,,,,
ashwagandha,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/1758044025428-generated-label-image-3.jpg?v=1758045639,5,,,,,,,,,,,,,,,,,,,,,,,,,
ashwagandha,,,,,,,,,,,,,,,,,,,,,,,,,,,https://cdn.shopify.com/s/files/1/0678/4928/9863/files/20250617185154-vox4ashw-sf.png?v=1758045639,6,,,,,,,,,,,,,,,,,,,,,,,,,
`;
