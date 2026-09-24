import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
  Star,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  SlidersHorizontal,
  CheckSquare,
  Square,
  MinusSquare,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Percent,
  RefreshCw,
  FileSpreadsheet,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Layers,
  Tag,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { productApi, categoryApi, brandApi, adminApi } from '../../services/api';
import { getProductImage } from '../../utils/imageHelper';

export const AdminProducts = () => {
  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStockFilter, setSelectedStockFilter] = useState('ALL'); // 'ALL' | 'HEALTHY' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'

  // Sorting State
  const [sortField, setSortField] = useState('createdAt'); // 'price' | 'stock' | 'name' | 'createdAt'
  const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'

  // Pagination State
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState(new Set());
  const selectAllCheckboxRef = useRef(null);

  // Modals State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Quick In-Place Stock & Price Edit Modal
  const [quickEditModalOpen, setQuickEditModalOpen] = useState(false);
  const [quickEditProduct, setQuickEditProduct] = useState(null);
  const [quickEditForm, setQuickEditForm] = useState({
    price: '',
    discountPercent: 0,
    stockQuantity: 10,
    active: true,
  });
  const [quickSaving, setQuickSaving] = useState(false);

  // Bulk Price Adjustment Modal
  const [bulkPriceModalOpen, setBulkPriceModalOpen] = useState(false);
  const [bulkPricePercent, setBulkPricePercent] = useState('10');
  const [bulkPriceSaving, setBulkPriceSaving] = useState(false);

  // CSV Import Modal
  const [csvImportModalOpen, setCsvImportModalOpen] = useState(false);
  const [importedRows, setImportedRows] = useState([]);
  const [importing, setImporting] = useState(false);

  const { success, error: toastError } = useToast();

  // Full Add/Edit Form Data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    price: '',
    discountPercent: 0,
    stockQuantity: 10,
    sku: '',
    categoryId: '',
    brandId: '',
    imageUrls: [''],
    primaryImageUrl: '',
    featured: false,
    isNewArrival: false,
    isBestSeller: false,
    isTrending: false,
    specifications: '',
    active: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {
        query: searchQuery.trim() || undefined,
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        inStockOnly: selectedStockFilter === 'HEALTHY',
        sortBy: sortField === 'stock' ? 'stockQuantity' : sortField,
        sortDir: sortDir,
        page: page,
        size: pageSize,
      };

      const [prodRes, catRes, brandRes] = await Promise.all([
        productApi.getProducts(params),
        categoryApi.getActive().catch(() => ({ data: [] })),
        brandApi.getActive().catch(() => ({ data: [] })),
      ]);

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data.content || []);
        setTotalPages(prodRes.data.totalPages || 1);
        setTotalElements(prodRes.data.totalElements || 0);
      }
      if (catRes.success) setCategories(catRes.data || []);
      if (brandRes.success) setBrands(brandRes.data || []);
    } catch (err) {
      console.error(err);
      toastError(err.message || 'Failed to load products catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory, selectedStockFilter, sortField, sortDir, page, pageSize]);

  // Client-side refined list for stock threshold specifics & active status
  const displayedProducts = useMemo(() => {
    return products.filter((p) => {
      // Stock Threshold Filter
      if (selectedStockFilter === 'LOW_STOCK' && (p.stockQuantity >= 10 || p.stockQuantity <= 0)) {
        return false;
      }
      if (selectedStockFilter === 'OUT_OF_STOCK' && p.stockQuantity > 0) {
        return false;
      }
      if (selectedStockFilter === 'HEALTHY' && p.stockQuantity < 10) {
        return false;
      }

      // Status Filter
      if (selectedStatusFilter === 'ACTIVE' && !p.active) return false;
      if (selectedStatusFilter === 'INACTIVE' && p.active) return false;

      return true;
    });
  }, [products, selectedStockFilter, selectedStatusFilter]);

  // Handle Select All Checkbox Indeterminate & Checked States
  const allCurrentPageSelected =
    displayedProducts.length > 0 &&
    displayedProducts.every((p) => selectedIds.has(p.id));
  const someCurrentPageSelected =
    displayedProducts.some((p) => selectedIds.has(p.id)) && !allCurrentPageSelected;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someCurrentPageSelected;
    }
  }, [someCurrentPageSelected]);

  const handleToggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (allCurrentPageSelected) {
      displayedProducts.forEach((p) => next.delete(p.id));
    } else {
      displayedProducts.forEach((p) => next.add(p.id));
    }
    setSelectedIds(next);
  };

  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Header Column Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      if (sortDir === 'asc') {
        setSortDir('desc');
      } else {
        setSortField('createdAt');
        setSortDir('desc');
      }
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(0);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStockFilter('ALL');
    setSelectedStatusFilter('ALL');
    setSortField('createdAt');
    setSortDir('desc');
    setPage(0);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'ALL' ||
    selectedStockFilter !== 'ALL' ||
    selectedStatusFilter !== 'ALL' ||
    sortField !== 'createdAt';

  // --- Quick Edit Handler ---
  const handleOpenQuickEdit = (prod) => {
    setQuickEditProduct(prod);
    setQuickEditForm({
      price: prod.price,
      discountPercent: prod.discountPercent || 0,
      stockQuantity: prod.stockQuantity,
      active: prod.active !== undefined ? prod.active : true,
    });
    setQuickEditModalOpen(true);
  };

  const handleSaveQuickEdit = async (e) => {
    e.preventDefault();
    if (!quickEditProduct) return;
    try {
      setQuickSaving(true);
      const validImages =
        quickEditProduct.images && quickEditProduct.images.length > 0
          ? quickEditProduct.images
          : quickEditProduct.primaryImageUrl
          ? [quickEditProduct.primaryImageUrl]
          : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'];

      const payload = {
        name: quickEditProduct.name,
        slug: quickEditProduct.slug,
        shortDescription: quickEditProduct.shortDescription || '',
        description: quickEditProduct.description || '',
        price: Number(quickEditForm.price),
        discountPercent: Number(quickEditForm.discountPercent),
        stockQuantity: Number(quickEditForm.stockQuantity),
        sku: quickEditProduct.sku || '',
        categoryId: quickEditProduct.category?.id || null,
        brandId: quickEditProduct.brand?.id || null,
        imageUrls: validImages,
        primaryImageUrl: quickEditProduct.primaryImageUrl || validImages[0],
        featured: quickEditProduct.featured || false,
        isNewArrival: quickEditProduct.isNewArrival || false,
        isBestSeller: quickEditProduct.isBestSeller || false,
        isTrending: quickEditProduct.isTrending || false,
        specifications: quickEditProduct.specifications || '',
        active: quickEditForm.active,
      };

      await adminApi.updateProduct(quickEditProduct.id, payload);
      success(`Updated ${quickEditProduct.name} (Stock: ${quickEditForm.stockQuantity}, Price: ₹${quickEditForm.price})`);
      setQuickEditModalOpen(false);
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to update product details');
    } finally {
      setQuickSaving(false);
    }
  };

  // --- Bulk Actions ---
  const handleBulkStatus = async (newStatus) => {
    if (selectedIds.size === 0) return;
    try {
      setLoading(true);
      const idsToUpdate = Array.from(selectedIds);
      const prodsToUpdate = products.filter((p) => idsToUpdate.includes(p.id));

      await Promise.all(
        prodsToUpdate.map((p) => {
          const payload = {
            name: p.name,
            slug: p.slug,
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            price: p.price,
            discountPercent: p.discountPercent || 0,
            stockQuantity: p.stockQuantity,
            sku: p.sku || '',
            categoryId: p.category?.id || null,
            brandId: p.brand?.id || null,
            imageUrls: p.images || (p.primaryImageUrl ? [p.primaryImageUrl] : []),
            primaryImageUrl: p.primaryImageUrl || '',
            active: newStatus,
          };
          return adminApi.updateProduct(p.id, payload);
        })
      );

      success(`Updated status of ${prodsToUpdate.length} products to ${newStatus ? 'Active' : 'Inactive'}!`);
      setSelectedIds(new Set());
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to update product statuses');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete all ${selectedIds.size} selected products?`)) return;

    try {
      setLoading(true);
      const idsToDelete = Array.from(selectedIds);
      await Promise.all(idsToDelete.map((id) => adminApi.deleteProduct(id)));
      success(`Successfully deleted ${idsToDelete.length} products!`);
      setSelectedIds(new Set());
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to delete selected products');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPriceAdjust = async (e) => {
    e.preventDefault();
    const pct = Number(bulkPricePercent);
    if (isNaN(pct) || pct === 0) {
      toastError('Please enter a non-zero percentage (e.g. +10 for markup or -15 for discount sale)');
      return;
    }

    try {
      setBulkPriceSaving(true);
      const idsToUpdate = Array.from(selectedIds);
      const prodsToUpdate = products.filter((p) => idsToUpdate.includes(p.id));

      await Promise.all(
        prodsToUpdate.map((p) => {
          const originalPrice = Number(p.price) || 0;
          const factor = 1 + pct / 100;
          const newPrice = Math.max(1, Math.round(originalPrice * factor));

          const payload = {
            name: p.name,
            slug: p.slug,
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            price: newPrice,
            discountPercent: p.discountPercent || 0,
            stockQuantity: p.stockQuantity,
            sku: p.sku || '',
            categoryId: p.category?.id || null,
            brandId: p.brand?.id || null,
            imageUrls: p.images || (p.primaryImageUrl ? [p.primaryImageUrl] : []),
            primaryImageUrl: p.primaryImageUrl || '',
            active: p.active !== undefined ? p.active : true,
          };
          return adminApi.updateProduct(p.id, payload);
        })
      );

      success(`Adjusted prices by ${pct > 0 ? '+' : ''}${pct}% across ${prodsToUpdate.length} products!`);
      setBulkPriceModalOpen(false);
      setSelectedIds(new Set());
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to bulk adjust product prices');
    } finally {
      setBulkPriceSaving(false);
    }
  };

  // --- CSV Export & Import ---
  const handleExportCsv = () => {
    const exportItems =
      selectedIds.size > 0
        ? products.filter((p) => selectedIds.has(p.id))
        : displayedProducts;

    if (exportItems.length === 0) {
      toastError('No products available to export');
      return;
    }

    const headers = [
      'ID',
      'Name',
      'SKU',
      'Category',
      'Brand',
      'Base Price (₹)',
      'Discount %',
      'Final Price (₹)',
      'Stock Quantity',
      'Status',
      'Created At',
    ];

    const rows = exportItems.map((p) => [
      p.id,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.sku || ''}"`,
      `"${p.category?.name || 'Uncategorized'}"`,
      `"${p.brand?.name || ''}"`,
      p.price || 0,
      p.discountPercent || 0,
      p.discountedPrice || p.price || 0,
      p.stockQuantity || 0,
      p.active ? 'Active' : 'Inactive',
      `"${p.createdAt ? new Date(p.createdAt).toISOString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShopSphere_Product_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success(`Exported ${exportItems.length} products to CSV!`);
  };

  const handleDownloadCsvTemplate = () => {
    const headers = ['Name', 'Price', 'DiscountPercent', 'StockQuantity', 'Category', 'Brand', 'SKU', 'ShortDescription', 'PrimaryImageUrl'];
    const sampleRows = [
      ['"Apple iPhone 15 (Blue 128GB)"', '69999', '12', '45', '"Electronics"', '"Apple"', '"FK-IPHONE15-128BL"', '"Dynamic Island 48MP camera smartphone"', '"https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/k/l/l/-original-imagtc5fz9spysyk.jpeg"'],
      ['"Puma Men Softride Enzo Running Shoes"', '3499', '45', '60', '"Fashion"', '"Puma"', '"FK-PUMA-SOFTRIDE-01"', '"Breathable mesh with Softride cushioning"', '"https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/7/2/m/6-376662-puma-black-white-original-imaghr6g6zgvhh6y.jpeg"'],
      ['"Prestige Iris 750W Mixer Grinder"', '3199', '48', '35', '"Home"', '"Prestige"', '"FK-PRESTIGE-IRIS-750"', '"Powerful 750W motor with 3 SS jars"', '"https://rukminim2.flixcart.com/image/832/832/xif0q/mixer-grinder-juicer/e/i/e/-original-imagm9fzzgzgqjh.jpeg"']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...sampleRows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ShopSphere_Catalog_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJsonTemplate = () => {
    const sampleJson = [
      {
        name: "SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)",
        categorySlug: "electronics",
        brandName: "Samsung",
        price: 129999,
        discountPercent: 10,
        stockQuantity: 50,
        sku: "FK-SAMSUNG-S24U",
        shortDescription: "12GB RAM, 200MP Quad Camera with Galaxy AI",
        description: "Meet Galaxy S24 Ultra with titanium exterior and 6.8 inch flat Dynamic AMOLED display.",
        primaryImageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/5/t/j/-original-imagx9eg4e377gfh.jpeg",
        imageUrls: [
          "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/5/t/j/-original-imagx9eg4e377gfh.jpeg"
        ],
        specifications: "{\"RAM\":\"12 GB\",\"Storage\":\"256 GB\",\"Display\":\"6.8 inch AMOLED\"}"
      },
      {
        name: "Levi's Men Regular Fit Mid Rise Jeans",
        categorySlug: "fashion",
        brandName: "Levi's",
        price: 2799,
        discountPercent: 40,
        stockQuantity: 80,
        sku: "FK-LEVIS-JEANS-01",
        shortDescription: "Classic 5-pocket denim styling with comfort stretch cotton fabric",
        description: "Authentic Levis craftsmanship designed for everyday durability and effortless casual style.",
        primaryImageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/jean/d/s/c/32-18298-1234-levi-s-original-imagvfzgvhhzgvhh.jpeg",
        imageUrls: [
          "https://rukminim2.flixcart.com/image/832/832/xif0q/jean/d/s/c/32-18298-1234-levi-s-original-imagvfzgvhhzgvhh.jpeg"
        ]
      }
    ];

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sampleJson, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'ShopSphere_Flipkart_Template.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFetchDummyJsonDemo = async () => {
    try {
      setImporting(true);
      const res = await fetch('https://dummyjson.com/products?limit=25');
      const data = await res.json();
      const rawProducts = data.products || [];

      const parsed = rawProducts.map((p, idx) => {
        const cat = (p.category || '').toLowerCase();
        let mappedCat = 'electronics';
        if (cat.includes('shirt') || cat.includes('dress') || cat.includes('shoe') || cat.includes('watch') || cat.includes('bag') || cat.includes('jewel') || cat.includes('top')) {
          mappedCat = 'fashion';
        } else if (cat.includes('beauty') || cat.includes('skin') || cat.includes('fragrance')) {
          mappedCat = 'beauty-personal-care';
        } else if (cat.includes('furniture') || cat.includes('home') || cat.includes('kitchen') || cat.includes('grocer')) {
          mappedCat = 'home-living';
        } else if (cat.includes('sport') || cat.includes('vehicle') || cat.includes('motor')) {
          mappedCat = 'sports-outdoors';
        }

        const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.thumbnail];
        return {
          name: p.title,
          price: Math.round((p.price || 50) * 85),
          discountPercent: Math.round(p.discountPercentage || 10),
          stockQuantity: p.stock || 30,
          sku: p.sku || `DJ-${p.id}-${Date.now().toString().slice(-4)}`,
          categorySlug: mappedCat,
          brandName: p.brand || p.title.split(' ')[0] || 'Generic',
          shortDescription: p.description?.slice(0, 120) || p.title,
          description: p.description || p.title,
          primaryImageUrl: p.thumbnail || images[0],
          imageUrls: images,
          specifications: JSON.stringify({ Rating: `${p.rating} / 5.0`, Warranty: p.warrantyInformation || '1 Year' })
        };
      });

      setImportedRows(parsed);
      success(`Fetched ${parsed.length} live products from DummyJSON! Review preview and click "Import Products".`);
    } catch (err) {
      toastError('Failed to fetch from DummyJSON: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleCatalogFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const isJson = file.name.toLowerCase().endsWith('.json');

        if (isJson) {
          const parsedJson = JSON.parse(text);
          const list = Array.isArray(parsedJson) ? parsedJson : (parsedJson.products || [parsedJson]);
          if (list.length === 0) {
            toastError('JSON file does not contain any product items');
            return;
          }

          const parsed = list.map((item, idx) => {
            const images = Array.isArray(item.imageUrls) ? item.imageUrls : (Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []));
            const primary = item.primaryImageUrl || item.thumbnail || item.image || (images.length > 0 ? images[0] : '');

            return {
              name: item.name || item.title || `Catalog Product #${idx + 1}`,
              price: Number(item.price) || 999,
              discountPercent: Number(item.discountPercent || item.discountPercentage || 0),
              stockQuantity: Number(item.stockQuantity || item.stock || 25),
              sku: item.sku || `SKU-IMP-${Date.now().toString().slice(-6)}-${idx + 1}`,
              categorySlug: item.categorySlug || item.category || 'electronics',
              brandName: item.brandName || item.brand || 'Generic',
              shortDescription: item.shortDescription || item.description?.slice(0, 150) || item.name,
              description: item.description || item.name,
              primaryImageUrl: primary,
              imageUrls: images.length > 0 ? images : (primary ? [primary] : []),
              specifications: typeof item.specifications === 'string' ? item.specifications : JSON.stringify(item.specifications || {})
            };
          });

          setImportedRows(parsed);
          success(`Loaded ${parsed.length} products from JSON catalog! Ready to import.`);
          return;
        }

        // CSV parsing
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          toastError('CSV file is empty or missing header rows');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());
        const nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('title'));
        const priceIdx = headers.findIndex((h) => h.includes('price'));
        const stockIdx = headers.findIndex((h) => h.includes('stock'));
        const discountIdx = headers.findIndex((h) => h.includes('discount'));
        const skuIdx = headers.findIndex((h) => h.includes('sku'));
        const descIdx = headers.findIndex((h) => h.includes('desc'));
        const catIdx = headers.findIndex((h) => h.includes('cat'));
        const brandIdx = headers.findIndex((h) => h.includes('brand'));
        const imgIdx = headers.findIndex((h) => h.includes('image') || h.includes('url') || h.includes('photo'));

        if (nameIdx === -1 || priceIdx === -1) {
          toastError('CSV must include at least "Name" and "Price" columns');
          return;
        }

        const parsed = [];
        for (let i = 1; i < lines.length; i++) {
          // Match CSV tokens handling quoted strings
          const rowMatches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
          const row = rowMatches.map((c) => c.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          if (row[nameIdx]) {
            const imgUrl = imgIdx !== -1 && row[imgIdx] ? row[imgIdx] : '';
            parsed.push({
              name: row[nameIdx],
              price: Number(row[priceIdx]) || 999,
              discountPercent: discountIdx !== -1 ? Number(row[discountIdx]) || 0 : 0,
              stockQuantity: stockIdx !== -1 ? Number(row[stockIdx]) || 20 : 20,
              sku: skuIdx !== -1 && row[skuIdx] ? row[skuIdx] : `SKU-CSV-${Date.now().toString().slice(-4)}-${i}`,
              categorySlug: catIdx !== -1 && row[catIdx] ? row[catIdx].toLowerCase() : 'electronics',
              brandName: brandIdx !== -1 && row[brandIdx] ? row[brandIdx] : 'Generic',
              shortDescription: descIdx !== -1 ? row[descIdx] : row[nameIdx],
              description: descIdx !== -1 ? row[descIdx] : row[nameIdx],
              primaryImageUrl: imgUrl,
              imageUrls: imgUrl ? [imgUrl] : []
            });
          }
        }

        setImportedRows(parsed);
        success(`Read ${parsed.length} valid product rows from CSV. Preview below and click "Import Products".`);
      } catch (err) {
        toastError('Failed to parse file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    if (importedRows.length === 0) return;
    try {
      setImporting(true);
      const res = await adminApi.bulkImportProducts(importedRows);
      const info = res.data;

      success(`Successfully imported ${info?.importedCount || importedRows.length} products to ShopSphere catalog!`);
      setCsvImportModalOpen(false);
      setImportedRows([]);
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to import products');
    } finally {
      setImporting(false);
    }
  };

  // --- Full Product Add / Edit Handlers ---
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      price: '',
      discountPercent: 0,
      stockQuantity: 10,
      sku: '',
      categoryId: categories[0]?.id || '',
      brandId: brands[0]?.id || '',
      imageUrls: [''],
      primaryImageUrl: '',
      featured: false,
      isNewArrival: false,
      isBestSeller: false,
      isTrending: false,
      specifications: '',
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    const existingImages =
      prod.images && prod.images.length > 0
        ? [...prod.images]
        : prod.primaryImageUrl
        ? [prod.primaryImageUrl]
        : [''];

    setFormData({
      name: prod.name,
      slug: prod.slug,
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      price: prod.price,
      discountPercent: prod.discountPercent || 0,
      stockQuantity: prod.stockQuantity,
      sku: prod.sku || '',
      categoryId: prod.category?.id || '',
      brandId: prod.brand?.id || '',
      imageUrls: existingImages,
      primaryImageUrl: prod.primaryImageUrl || existingImages[0] || '',
      featured: prod.featured || false,
      isNewArrival: prod.isNewArrival || false,
      isBestSeller: prod.isBestSeller || false,
      isTrending: prod.isTrending || false,
      specifications: prod.specifications || '',
      active: prod.active !== undefined ? prod.active : true,
    });
    setModalOpen(true);
  };

  const handleAddImageUrlField = () => {
    setFormData({
      ...formData,
      imageUrls: [...formData.imageUrls, ''],
    });
  };

  const handleRemoveImageUrlField = (index) => {
    const updated = formData.imageUrls.filter((_, i) => i !== index);
    const newUrls = updated.length > 0 ? updated : [''];
    const removedUrl = formData.imageUrls[index];
    const newPrimary =
      formData.primaryImageUrl === removedUrl
        ? (newUrls[0] && newUrls[0].trim().length > 0 ? newUrls[0].trim() : '')
        : formData.primaryImageUrl;

    setFormData({
      ...formData,
      imageUrls: newUrls,
      primaryImageUrl: newPrimary,
    });
  };

  const handleImageUrlChange = (index, value) => {
    const updated = [...formData.imageUrls];
    updated[index] = value;
    const oldPrimary = formData.primaryImageUrl;
    const newPrimary =
      !oldPrimary || oldPrimary === formData.imageUrls[index]
        ? value.trim()
        : oldPrimary;
    setFormData({
      ...formData,
      imageUrls: updated,
      primaryImageUrl: newPrimary,
    });
  };

  const handleSetPrimaryImage = (url) => {
    if (!url || !url.trim()) return;
    setFormData({
      ...formData,
      primaryImageUrl: url.trim(),
    });
  };

  const handleUploadImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please select a valid image file (PNG, JPG, JPEG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toastError('Image file size must be less than 10MB');
      return;
    }

    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('file', file);
      const res = await adminApi.uploadProductImage(data);
      if (res.success && res.data?.imageUrl) {
        const uploadedUrl = res.data.imageUrl;
        const currentNonEmpty = (formData.imageUrls || []).filter((u) => u && u.trim().length > 0);
        const nextUrls = [...currentNonEmpty, uploadedUrl];
        setFormData({
          ...formData,
          imageUrls: nextUrls,
          primaryImageUrl: formData.primaryImageUrl && formData.primaryImageUrl.trim().length > 0
            ? formData.primaryImageUrl
            : uploadedUrl,
        });
        success('Image file uploaded and added to product gallery!');
      } else {
        toastError(res.message || 'Failed to upload image');
      }
    } catch (err) {
      toastError(err.message || 'Error uploading image file to server');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const validImages = (formData.imageUrls || [])
        .map((u) => (typeof u === 'string' ? u.trim() : ''))
        .filter((u) => u.length > 0);

      if (validImages.length === 0) {
        toastError('Please provide or upload at least one valid Product Image');
        setSaving(false);
        return;
      }

      const primary =
        formData.primaryImageUrl && validImages.includes(formData.primaryImageUrl.trim())
          ? formData.primaryImageUrl.trim()
          : validImages[0];

      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPercent: Number(formData.discountPercent),
        stockQuantity: Number(formData.stockQuantity),
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        brandId: formData.brandId ? Number(formData.brandId) : null,
        imageUrls: validImages,
        primaryImageUrl: primary,
      };

      let updatedProduct = null;
      if (editingProduct) {
        const res = await adminApi.updateProduct(editingProduct.id, payload);
        updatedProduct = res.data;
        success(`Product "${formData.name}" updated successfully with ${validImages.length} photos!`);
      } else {
        const res = await adminApi.createProduct(payload);
        updatedProduct = res.data;
        success(`Product "${formData.name}" created successfully with ${validImages.length} photos!`);
      }

      setModalOpen(false);

      // Immediately synchronize local state so changes reflect instantly
      if (updatedProduct && editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
        );
      }

      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;

    const previousProducts = [...products];
    const previousTotal = totalElements;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTotalElements((prev) => Math.max(0, prev - 1));

    try {
      await adminApi.deleteProduct(id);
      success('Product permanently deleted from database!');
      loadData();
    } catch (err) {
      setProducts(previousProducts);
      setTotalElements(previousTotal);
      toastError(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Product Inventory</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {totalElements} SKUs
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock thresholds, bulk catalog operations, valuation rates, and CSV synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            title="Export products to CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* Import CSV */}
          <button
            onClick={() => setCsvImportModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            title="Import products from CSV file"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Import CSV</span>
          </button>

          {/* Add New Product */}
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Advanced Filtering & Search Bar */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-4 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Real-time Search by Name or SKU */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Product Name or SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(0);
              }}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug || c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Threshold Filter */}
          <div>
            <select
              value={selectedStockFilter}
              onChange={(e) => {
                setSelectedStockFilter(e.target.value);
                setPage(0);
              }}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="HEALTHY">✅ Healthy Stock (≥ 10 units)</option>
              <option value="LOW_STOCK">⚠️ Low Stock (&lt; 10 units)</option>
              <option value="OUT_OF_STOCK">❌ Out of Stock (0 units)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatusFilter}
              onChange={(e) => {
                setSelectedStatusFilter(e.target.value);
                setPage(0);
              }}
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                title="Reset all search filters"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Pill Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
          <span className="text-slate-500 font-semibold">Quick Filters:</span>
          <button
            onClick={() => setSelectedStockFilter(selectedStockFilter === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
              selectedStockFilter === 'LOW_STOCK'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Low Stock (&lt; 10)</span>
          </button>

          <button
            onClick={() => setSelectedStockFilter(selectedStockFilter === 'OUT_OF_STOCK' ? 'ALL' : 'OUT_OF_STOCK')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
              selectedStockFilter === 'OUT_OF_STOCK'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span>Out of Stock</span>
          </button>

          <button
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
              selectedStatusFilter === 'ACTIVE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Active Products</span>
          </button>

          <div className="ml-auto text-slate-400 font-mono text-[11px]">
            Sort: <b className="text-white capitalize">{sortField}</b> ({sortDir.toUpperCase()})
          </div>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                {/* Select All Checkbox */}
                <th className="p-4 w-10 text-center">
                  <input
                    ref={selectAllCheckboxRef}
                    type="checkbox"
                    checked={allCurrentPageSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </th>

                {/* Column: Product Name & SKU (Sortable) */}
                <th
                  onClick={() => handleSort('name')}
                  className="p-4 cursor-pointer select-none hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Product Details & SKU</span>
                    {sortField === 'name' ? (
                      sortDir === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-600 opacity-60" />
                    )}
                  </div>
                </th>

                <th className="p-4">Category</th>

                {/* Column: Price / Discount (Sortable) */}
                <th
                  onClick={() => handleSort('price')}
                  className="p-4 cursor-pointer select-none hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Price / Discount</span>
                    {sortField === 'price' ? (
                      sortDir === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-600 opacity-60" />
                    )}
                  </div>
                </th>

                {/* Column: Stock Units (Sortable) */}
                <th
                  onClick={() => handleSort('stock')}
                  className="p-4 cursor-pointer select-none hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Stock Units</span>
                    {sortField === 'stock' ? (
                      sortDir === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-600 opacity-60" />
                    )}
                  </div>
                </th>

                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                    <span>Loading products inventory catalog...</span>
                  </td>
                </tr>
              ) : displayedProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                    <p className="font-semibold text-slate-400">No products matching the active filters.</p>
                    <p className="text-xs text-slate-600 mt-1">Try resetting search filters or adding a new product.</p>
                  </td>
                </tr>
              ) : (
                displayedProducts.map((p) => {
                  const isSelected = selectedIds.has(p.id);

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-indigo-950/30 hover:bg-indigo-950/40'
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Row Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p.id)}
                          className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                      </td>

                      {/* Product details & SKU */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={getProductImage(p)}
                            alt=""
                            className="w-11 h-11 rounded-xl object-cover border border-slate-800 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white line-clamp-1 max-w-xs">{p.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-500 font-mono font-bold">
                                SKU: {p.sku || `SKU-${p.id}`}
                              </span>
                              {p.brand && (
                                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                                  {p.brand.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="text-slate-300 font-semibold">{p.category?.name || 'Uncategorized'}</span>
                      </td>

                      {/* Price / Discount (Clickable to quick-edit) */}
                      <td className="p-4">
                        <button
                          onClick={() => handleOpenQuickEdit(p)}
                          className="text-left group focus:outline-none cursor-pointer"
                          title="Click to quick-update price & discount"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-emerald-400 group-hover:underline">
                              ₹{Number(p.discountedPrice || p.price).toLocaleString('en-IN')}
                            </span>
                            {p.discountPercent > 0 && (
                              <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                                {p.discountPercent}% Off
                              </span>
                            )}
                          </div>
                          {p.discountPercent > 0 && (
                            <p className="text-[10px] text-slate-500 line-through">
                              ₹{Number(p.price).toLocaleString('en-IN')}
                            </p>
                          )}
                        </button>
                      </td>

                      {/* Stock units with Dynamic Badges (Clickable to quick-edit) */}
                      <td className="p-4">
                        <button
                          onClick={() => handleOpenQuickEdit(p)}
                          className="group focus:outline-none cursor-pointer"
                          title="Click to quick-update stock"
                        >
                          {p.stockQuantity >= 10 ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 inline-flex items-center gap-1 group-hover:border-emerald-600 transition-colors">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{p.stockQuantity} in stock</span>
                            </span>
                          ) : p.stockQuantity > 0 ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80 inline-flex items-center gap-1 animate-pulse group-hover:border-amber-600 transition-colors">
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              <span>Low Stock: {p.stockQuantity}</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/80 inline-flex items-center gap-1 group-hover:border-rose-600 transition-colors">
                              <AlertCircle className="w-3 h-3 text-rose-400" />
                              <span>Out of Stock (0)</span>
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.active
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border-rose-800'
                          }`}
                        >
                          {p.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Quick Edit In-Place */}
                          <button
                            onClick={() => handleOpenQuickEdit(p)}
                            className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors cursor-pointer"
                            title="Quick Stock & Price Edit"
                          >
                            <Zap className="w-3.5 h-3.5" />
                          </button>

                          {/* Full Edit Modal */}
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                            title="Edit Full Attributes & Photos"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Pagination & Per-Page Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Showing</span>
            <span className="text-white font-bold">
              {displayedProducts.length > 0 ? page * pageSize + 1 : 0}
            </span>
            <span>to</span>
            <span className="text-white font-bold">
              {Math.min((page + 1) * pageSize, totalElements)}
            </span>
            <span>of</span>
            <span className="text-white font-bold">{totalElements}</span>
            <span>products</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Per Page Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
              </select>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {/* Page Jump Number Buttons with Smart Window */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i)
                    .filter((p) => p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-slate-600">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`min-w-[28px] h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            page === p
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                              : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          {p + 1}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BAR FOR BULK MANAGEMENT */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-indigo-500/50 shadow-2xl shadow-indigo-950/80 rounded-2xl px-5 py-3 flex flex-wrap items-center gap-3 text-white backdrop-blur-md">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-black text-indigo-300 font-mono">{selectedIds.size}</span>
            <span className="text-xs font-semibold text-slate-300">selected</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleBulkStatus(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Set Active</span>
            </button>

            <button
              onClick={() => handleBulkStatus(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Set Inactive</span>
            </button>

            <button
              onClick={() => setBulkPriceModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold border border-indigo-500/30 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Bulk Price %</span>
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Delete</span>
            </button>
          </div>

          <button
            onClick={() => setSelectedIds(new Set())}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            title="Deselect all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* QUICK IN-PLACE STOCK & PRICE UPDATE MODAL */}
      <Modal
        isOpen={quickEditModalOpen}
        onClose={() => setQuickEditModalOpen(false)}
        title="Quick Update: Stock & Price"
        maxWidth="max-w-md"
      >
        {quickEditProduct && (
          <form onSubmit={handleSaveQuickEdit} className="space-y-4 text-slate-800">
            {/* Product Summary Card */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <img
                src={getProductImage(quickEditProduct)}
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{quickEditProduct.name}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  SKU: {quickEditProduct.sku || `SKU-${quickEditProduct.id}`}
                </p>
              </div>
            </div>

            {/* Price & Discount Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Price (₹) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quickEditForm.price}
                  onChange={(e) => setQuickEditForm({ ...quickEditForm, price: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={quickEditForm.discountPercent}
                  onChange={(e) => setQuickEditForm({ ...quickEditForm, discountPercent: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Stock Quantity Input & Quick Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                required
                value={quickEditForm.stockQuantity}
                onChange={(e) => setQuickEditForm({ ...quickEditForm, stockQuantity: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none font-mono font-bold"
              />

              {/* Quick stock chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {[
                  { label: '+10', add: 10 },
                  { label: '+25', add: 25 },
                  { label: '+50', add: 50 },
                  { label: '-5', add: -5 },
                  { label: 'Out of Stock (0)', set: 0 },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const current = Number(quickEditForm.stockQuantity) || 0;
                      if (chip.set !== undefined) {
                        setQuickEditForm({ ...quickEditForm, stockQuantity: chip.set });
                      } else {
                        setQuickEditForm({ ...quickEditForm, stockQuantity: Math.max(0, current + chip.add) });
                      }
                    }}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold border border-slate-200 transition-colors cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Product Visibility</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={quickEditForm.active}
                  onChange={(e) => setQuickEditForm({ ...quickEditForm, active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <span className="text-xs font-semibold text-slate-600">
                  {quickEditForm.active ? 'Active on Storefront' : 'Inactive (Hidden)'}
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={quickSaving}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-900/30 disabled:opacity-50 cursor-pointer"
              >
                {quickSaving ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* BULK PRICE ADJUSTMENT MODAL */}
      <Modal
        isOpen={bulkPriceModalOpen}
        onClose={() => setBulkPriceModalOpen(false)}
        title={`Bulk Price Adjustment (${selectedIds.size} Products)`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleBulkPriceAdjust} className="space-y-4 text-slate-800">
          <p className="text-xs text-slate-500">
            Apply a percentage markup or promotional markdown to all {selectedIds.size} selected products.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Percentage Change (%) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                required
                placeholder="e.g. 10 for +10% or -15 for -15%"
                value={bulkPricePercent}
                onChange={(e) => setBulkPricePercent(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-indigo-300 rounded-xl focus:outline-none font-bold text-indigo-700"
              />
              <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Quick Percentage Presets */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '+5% Markup', val: '5' },
              { label: '+10% Markup', val: '10' },
              { label: '+20% Markup', val: '20' },
              { label: '-10% Flash Sale', val: '-10' },
              { label: '-20% Clearance', val: '-20' },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setBulkPricePercent(preset.val)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Preview Example:</span>
            </p>
            <p className="text-[11px]">
              A product currently priced at ₹1,000 will be recalculated to{' '}
              <b className="font-mono">
                ₹
                {Math.max(
                  1,
                  Math.round(1000 * (1 + (Number(bulkPricePercent) || 0) / 100))
                ).toLocaleString('en-IN')}
              </b>
              .
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setBulkPriceModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bulkPriceSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-900/30 disabled:opacity-50 cursor-pointer"
            >
              {bulkPriceSaving ? 'Applying Prices...' : 'Apply Price Adjustment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* UNIVERSAL BULK CATALOG IMPORT MODAL (JSON / CSV / DUMMYJSON) */}
      <Modal
        isOpen={csvImportModalOpen}
        onClose={() => {
          setCsvImportModalOpen(false);
          setImportedRows([]);
        }}
        title="Bulk Catalog Import (Flipkart JSON / CSV / Live Sync)"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-slate-800">
          {/* Quick Actions Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            {/* Download JSON Template */}
            <button
              onClick={handleDownloadJsonTemplate}
              type="button"
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" />
              <span>Flipkart JSON Format</span>
            </button>

            {/* Download CSV Template */}
            <button
              onClick={handleDownloadCsvTemplate}
              type="button"
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>CSV Template</span>
            </button>

            {/* Live DummyJSON Fetch */}
            <button
              onClick={handleFetchDummyJsonDemo}
              disabled={importing}
              type="button"
              className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sync DummyJSON</span>
            </button>
          </div>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 bg-slate-50/50 text-center transition-colors">
            <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2 opacity-80" />
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Catalog File (.json or .csv)
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Upload exported Flipkart listings, DummyJSON products, or custom inventory spreadsheets.
            </p>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleCatalogFileUpload}
              className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
            />
          </div>

          {/* Preview of Imported Rows */}
          {importedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Parsed Products Preview</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold">
                    {importedRows.length} Items Ready
                  </span>
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Valid Catalog Schema</span>
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 text-[11px] bg-white shadow-2xs">
                {importedRows.slice(0, 8).map((r, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {r.primaryImageUrl ? (
                        <img
                          src={r.primaryImageUrl}
                          alt={r.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 truncate" title={r.name}>{r.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-600 font-mono">
                            {r.sku}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-indigo-50 text-indigo-600">
                            {r.categorySlug || 'Electronics'}
                          </span>
                          {r.brandName && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-50 text-amber-700">
                              {r.brandName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <p className="text-emerald-600 font-bold">
                        ₹{Number(r.price).toLocaleString('en-IN')}
                        {r.discountPercent > 0 && (
                          <span className="text-[10px] text-rose-500 font-normal ml-1">(-{r.discountPercent}%)</span>
                        )}
                      </p>
                      <p className="text-slate-400 text-[10px]">{r.stockQuantity} in stock</p>
                    </div>
                  </div>
                ))}
                {importedRows.length > 8 && (
                  <p className="p-2 text-center text-slate-500 text-[11px] bg-slate-50 font-medium">
                    + {importedRows.length - 8} additional products will be created in this batch...
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setCsvImportModalOpen(false);
                setImportedRows([]);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={importedRows.length === 0 || importing}
              onClick={handleExecuteImport}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-900/30 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{importing ? 'Importing Batch...' : `Import ${importedRows.length} Products`}</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Product Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
              <select
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="">Select Brand (Optional)</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Base Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="2999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount %</label>
              <input
                type="number"
                min="0"
                max="99"
                placeholder="15"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="25"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Multi-Photo Manager */}
          <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Product Photo Gallery ({formData.imageUrls.filter((u) => u && u.trim().length > 0).length} Photos) *</span>
              </label>

              <div className="flex items-center gap-2">
                {/* Hidden File Input for Device Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadImageFile}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                />

                {/* Upload from PC Button */}
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 border border-indigo-200 shadow-2xs cursor-pointer"
                  title="Upload image directly from your computer"
                >
                  <Upload className={`w-3.5 h-3.5 ${uploadingImage ? 'animate-bounce' : ''}`} />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                </button>

                {/* Add Photo URL Button */}
                <button
                  type="button"
                  onClick={handleAddImageUrlField}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 border border-emerald-300 shadow-2xs cursor-pointer"
                  title="Add another photo URL input"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add URL Field</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Provide multiple image URLs or upload photos from your device. Click the <b>Star</b> icon to set the primary main storefront photo. Click the <b>Trash</b> icon to delete any photo.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {formData.imageUrls.map((url, idx) => {
                const trimmedUrl = (url || '').trim();
                const isPrimary =
                  (formData.primaryImageUrl && formData.primaryImageUrl.trim() === trimmedUrl) ||
                  (!formData.primaryImageUrl && idx === 0 && trimmedUrl.length > 0);

                return (
                  <div key={idx} className={`flex items-center gap-2 bg-white p-2 rounded-xl border shadow-xs transition-all ${
                    isPrimary ? 'border-amber-400/80 ring-2 ring-amber-400/20 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    {/* Live Thumbnail Preview */}
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center relative">
                      {trimmedUrl ? (
                        <img
                          src={trimmedUrl}
                          alt={`Photo #${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-slate-300" />
                      )}
                      {isPrimary && (
                        <div className="absolute top-0.5 right-0.5 bg-amber-500 rounded-full p-0.5 shadow-xs" title="Main Primary Photo">
                          <Star className="w-2.5 h-2.5 fill-white text-white" />
                        </div>
                      )}
                    </div>

                    {/* URL Input */}
                    <input
                      type="text"
                      required={idx === 0}
                      placeholder={`Photo URL #${idx + 1} (e.g. https://images.unsplash.com/... or /uploads/...)`}
                      value={url}
                      onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono text-slate-700"
                    />

                    {/* Set as Primary Main Photo Button */}
                    <button
                      type="button"
                      disabled={!trimmedUrl}
                      onClick={() => handleSetPrimaryImage(trimmedUrl)}
                      title={isPrimary ? 'Primary Storefront Photo' : 'Click to Make this the Primary Photo'}
                      className={`px-2 py-1.5 rounded-lg transition-all flex items-center gap-1 text-[10px] font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                        isPrimary
                          ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300 shadow-2xs font-black'
                          : 'bg-slate-100 text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isPrimary ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span className="hidden sm:inline">{isPrimary ? 'Primary' : 'Make Main'}</span>
                    </button>

                    {/* Delete Photo URL Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrlField(idx)}
                      title="Delete this photo"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary</label>
            <input
              type="text"
              placeholder="Brief 1-sentence product summary"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              placeholder="Full product overview, bullet points and key features"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span>Featured</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
              />
              <span>New Arrival</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
              />
              <span>Best Seller</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
              />
              <span>Trending</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
