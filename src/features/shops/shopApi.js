import { apiClient, normalizeApiError } from "../../lib/apiClient";

function normalizeProducts(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data?.products)) return payload.data.products;
  return [];
}

function pickShopName(shop) {
  return shop?.shopName || shop?.name || "Local Shop";
}

function pickShopLogo(shop) {
  return shop?.logo || shop?.logoUrl || shop?.image || shop?.avatar || "";
}

function mergeShopRecord(target, incoming) {
  if (!target && incoming) return incoming;
  if (!incoming) return target;

  return {
    ...target,
    ...incoming,
    shopName: pickShopName(target).length >= pickShopName(incoming).length ? pickShopName(target) : pickShopName(incoming),
    logo: target?.logo || pickShopLogo(incoming) || pickShopLogo(target)
  };
}

export function buildShopsFromProducts(products, featuredShops = []) {
  const byShopId = new Map();

  for (const item of products) {
    const shop = item?.shop;
    const shopId = shop?._id ? String(shop._id) : "";
    if (!shopId) continue;

    const current = byShopId.get(shopId) || {
      _id: shopId,
      shopName: pickShopName(shop),
      logo: pickShopLogo(shop),
      isOpen: shop?.isOpen !== false,
      productsCount: 0,
      sampleImage: ""
    };

    current.productsCount += 1;
    current.sampleImage = current.sampleImage || item?.images?.[0] || "";
    current.isOpen = current.isOpen && shop?.isOpen !== false;
    current.shopName = pickShopName(shop) || current.shopName;
    current.logo = current.logo || pickShopLogo(shop);

    byShopId.set(shopId, current);
  }

  for (const featured of featuredShops) {
    const shopId = featured?._id ? String(featured._id) : "";
    if (!shopId) continue;

    const current = byShopId.get(shopId) || {
      _id: shopId,
      productsCount: 0,
      sampleImage: ""
    };

    byShopId.set(
      shopId,
      mergeShopRecord(current, {
        ...featured,
        _id: shopId,
        shopName: pickShopName(featured),
        logo: pickShopLogo(featured),
        isOpen: featured?.isOpen !== false
      })
    );
  }

  return Array.from(byShopId.values()).sort((a, b) => String(a.shopName || "").localeCompare(String(b.shopName || "")));
}

export async function fetchPublicShops() {
  try {
    const [{ data: productsPayload }, featuredResponse] = await Promise.all([
      apiClient.get("/api/products"),
      apiClient.get("/api/products/featured-shops").catch(() => ({ data: { data: [] } }))
    ]);

    const products = normalizeProducts(productsPayload);
    const featuredShops = Array.isArray(featuredResponse?.data?.data) ? featuredResponse.data.data : [];
    const shops = buildShopsFromProducts(products, featuredShops);

    return {
      shops,
      products
    };
  } catch (error) {
    throw normalizeApiError(error);
  }
}

