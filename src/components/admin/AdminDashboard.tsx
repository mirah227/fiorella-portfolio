import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  FileText,
  Globe,
  ExternalLink,
  LogOut,
  FolderTree,
  Tag,
  Shield,
  Layers
} from 'lucide-react';
import { Article, BlogCategory } from '../../types/blog';
import {
  getAllArticles,
  saveArticle,
  deleteArticle,
  toggleArticleStatus,
  fetchCategories,
  createCategory,
  removeCategory,
  ARTICLES_UPDATED_EVENT
} from '../../services/articleStorage';
import { logoutAdmin } from '../../services/authClient';
import { ArticleEditorModal } from './ArticleEditorModal';

interface AdminDashboardProps {
  adminEmail?: string;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateToArticle: (slug: string) => void;
}

type DashboardTab = 'articles' | 'published' | 'drafts' | 'categories';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminEmail,
  onLogout,
  onNavigateHome,
  onNavigateToArticle,
}) => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Category creation
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadData = async () => {
    const [articleList, categoryList] = await Promise.all([
      getAllArticles(),
      fetchCategories(),
    ]);
    setArticles(articleList);
    setCategories(categoryList);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener(ARTICLES_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(ARTICLES_UPDATED_EVENT, handleUpdate);
  }, []);

  const handleOpenNew = () => {
    setEditingArticle(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    await toggleArticleStatus(id);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await deleteArticle(id);
    setDeleteConfirmId(null);
    await loadData();
  };

  const handleSave = async (data: Partial<Article> & { title: string }) => {
    await saveArticle(data);
    await loadData();
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatError(null);
    setIsAddingCat(true);
    try {
      await createCategory(newCatName.trim(), newCatDesc.trim());
      setNewCatName('');
      setNewCatDesc('');
      await loadData();
    } catch (err: any) {
      setCatError(err.message || 'Failed to create category');
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    try {
      await removeCategory(catId);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const handleLogoutClick = async () => {
    await logoutAdmin();
    onLogout();
  };

  // Tab filtering
  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      currentTab === 'articles'
        ? true
        : currentTab === 'published'
        ? a.status === 'published'
        : currentTab === 'drafts'
        ? a.status === 'draft'
        : true;

    const matchesCategory =
      categoryFilter === 'all' ? true : a.category === categoryFilter;

    return matchesSearch && matchesTab && matchesCategory;
  });

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 md:pt-36 md:pb-24 bg-white dark:bg-[#0d0d0d] text-[#1a1a1a] dark:text-[#ededed]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Header & Account Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e5e5] dark:border-[#262626]">
          <div>
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
                Admin Blog Dashboard
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                <span>Admin</span>
              </span>
            </div>
            {adminEmail && (
              <p className="text-xs text-[#666666] dark:text-[#a3a3a3] mt-1 font-mono">
                Logged in as: <span className="font-bold text-[#1a1a1a] dark:text-white">{adminEmail}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenNew}
              id="admin-new-article-btn"
              className="inline-flex items-center gap-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-xs hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </button>

            <button
              onClick={handleLogoutClick}
              id="admin-logout-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-bold transition-colors"
              title="End admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-[#f8f8f8] dark:bg-[#141414] rounded-2xl border border-[#e5e5e5] dark:border-[#262626] text-xs font-bold">
          <button
            onClick={() => setCurrentTab('articles')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              currentTab === 'articles'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'text-[#666666] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>All Articles ({articles.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab('published')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              currentTab === 'published'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'text-[#666666] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>Published ({publishedCount})</span>
          </button>

          <button
            onClick={() => setCurrentTab('drafts')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              currentTab === 'drafts'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'text-[#666666] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Drafts ({draftCount})</span>
          </button>

          <button
            onClick={() => setCurrentTab('categories')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              currentTab === 'categories'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                : 'text-[#666666] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>
        </div>

        {/* Tab 1, 2, 3: Articles Listing View */}
        {currentTab !== 'categories' && (
          <>
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#666666] dark:text-[#a3a3a3] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title, category, or slug..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-xs font-medium text-[#1a1a1a] dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Category Select */}
              <div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-xs font-bold text-[#1a1a1a] dark:text-white focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Articles Table / List */}
            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#141414]">
                <p className="text-sm text-[#666666] dark:text-[#a3a3a3] font-medium mb-4">
                  No articles found in this view.
                </p>
                <button
                  onClick={handleOpenNew}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create an Article</span>
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#141414] rounded-2xl border border-[#e5e5e5] dark:border-[#262626] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f8f8] dark:bg-[#1a1a1a] border-b border-[#e5e5e5] dark:border-[#262626] text-[#666666] dark:text-[#a3a3a3] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Article</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Published Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5e5] dark:divide-[#262626]">
                      {filteredArticles.map((article) => {
                        const isPublished = article.status === 'published';
                        return (
                          <tr
                            key={article.id}
                            className="hover:bg-[#fbfbfb] dark:hover:bg-[#171717] transition-colors"
                          >
                            {/* Title & Thumbnail */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                {article.featuredImage?.url ? (
                                  <img
                                    src={article.featuredImage.url}
                                    alt={article.title}
                                    className="w-12 h-12 rounded-lg object-cover border border-[#e5e5e5] dark:border-[#262626] shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-[#f0f0f0] dark:bg-[#202020] flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-[#888]" />
                                  </div>
                                )}
                                <div className="max-w-md">
                                  <div className="font-black text-sm text-[#1a1a1a] dark:text-white line-clamp-1">
                                    {article.title}
                                  </div>
                                  <div className="text-[11px] font-mono text-[#666666] dark:text-[#a3a3a3] truncate">
                                    /blog/{article.slug}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-4 px-4">
                              <span className="font-bold text-white dark:text-black bg-black dark:bg-white px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                                {article.category}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4">
                              <button
                                onClick={() => handleToggleStatus(article.id)}
                                title={isPublished ? 'Click to unpublish' : 'Click to publish'}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors ${
                                  isPublished
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                <span className="capitalize">{article.status}</span>
                              </button>
                            </td>

                            {/* Published Date */}
                            <td className="py-4 px-4 text-[#666666] dark:text-[#a3a3a3] font-medium">
                              {formatDate(article.publishedAt)}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                {isPublished && (
                                  <button
                                    onClick={() => onNavigateToArticle(article.slug)}
                                    title="View public article"
                                    className="p-1.5 rounded-lg text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white hover:bg-[#f0f0f0] dark:hover:bg-[#202020] transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleEdit(article)}
                                  title="Edit article"
                                  className="p-1.5 rounded-lg text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white hover:bg-[#f0f0f0] dark:hover:bg-[#202020] transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => setDeleteConfirmId(article.id)}
                                  title="Delete article"
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab 4: Categories Management View */}
        {currentTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Add New Category Form */}
            <div className="lg:col-span-5 bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] rounded-2xl p-6">
              <h2 className="text-base font-black text-[#1a1a1a] dark:text-white uppercase tracking-tight mb-2">
                Create New Category
              </h2>
              <p className="text-xs text-[#666666] dark:text-[#a3a3a3] mb-5">
                Organize SEO insights by topical silos and specialization areas.
              </p>

              {catError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400">
                  {catError}
                </div>
              )}

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Programmatic SEO"
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Brief description of this topical category..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAddingCat}
                  className="w-full py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingCat ? 'Saving Category...' : 'Add Category'}</span>
                </button>
              </form>
            </div>

            {/* Right: Existing Categories List */}
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-base font-black text-[#1a1a1a] dark:text-white uppercase tracking-tight mb-2">
                Active Categories ({categories.length})
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {categories.map((cat) => {
                  const articleCount = articles.filter((a) => a.category.toLowerCase() === cat.name.toLowerCase()).length;
                  return (
                    <div
                      key={cat.id}
                      className="p-4 rounded-xl bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-black dark:text-white" />
                          <span className="text-sm font-black text-[#1a1a1a] dark:text-white">{cat.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#202020] border border-[#e5e5e5] dark:border-[#333] text-[#666666] dark:text-[#a3a3a3]">
                            {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-[#666666] dark:text-[#a3a3a3] font-normal pl-5">
                            {cat.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        title="Delete category"
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          onClick={() => setDeleteConfirmId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#141414] rounded-2xl max-w-sm w-full p-6 border border-[#e5e5e5] dark:border-[#262626] text-center"
          >
            <h3 className="text-base font-black text-[#1a1a1a] dark:text-white mb-2">
              Delete this article?
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#a3a3a3] mb-6">
              This action cannot be undone. The article and its clean URL will be removed permanently.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full border border-[#e5e5e5] dark:border-[#262626] text-xs font-bold text-[#1a1a1a] dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      <ArticleEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        initialArticle={editingArticle}
      />
    </div>
  );
};
