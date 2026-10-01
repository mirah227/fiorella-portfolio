import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  ExternalLink,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Article } from '../../types/blog';
import {
  getAllArticles,
  saveArticle,
  deleteArticle,
  toggleArticleStatus,
  ARTICLES_UPDATED_EVENT
} from '../../services/articleStorage';
import { ArticleEditorModal } from './ArticleEditorModal';

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onNavigateToArticle: (slug: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateHome,
  onNavigateToArticle,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchArticles = async () => {
    const list = await getAllArticles();
    setArticles(list);
  };

  useEffect(() => {
    fetchArticles();

    const handleUpdate = () => {
      fetchArticles();
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
    await fetchArticles();
  };

  const handleDelete = async (id: string) => {
    await deleteArticle(id);
    setDeleteConfirmId(null);
    await fetchArticles();
  };

  const handleSave = async (data: Partial<Article> & { title: string }) => {
    await saveArticle(data);
    await fetchArticles();
  };

  // Filtered articles
  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : a.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'all' ? true : a.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(articles.map((a) => a.category)));
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
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e5e5] dark:border-[#262626]">
          <div>
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Portfolio</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
              SEO Insights Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a3a3a3] mt-1">
              Manage, draft, and publish high-performance SEO articles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenNew}
              id="admin-new-article-button"
              className="inline-flex items-center gap-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-xs hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#1a1a1a] dark:text-white">{articles.length}</div>
              <div className="text-xs text-[#666666] dark:text-[#a3a3a3] font-medium">Total Articles</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#1a1a1a] dark:text-white">{publishedCount}</div>
              <div className="text-xs text-[#666666] dark:text-[#a3a3a3] font-medium">Published Live</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#1a1a1a] dark:text-white">{draftCount}</div>
              <div className="text-xs text-[#666666] dark:text-[#a3a3a3] font-medium">Drafts in Progress</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#666666] dark:text-[#a3a3a3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by article title, category, or slug..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-xs font-medium text-[#1a1a1a] dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] p-1 text-xs font-bold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-[#666666] dark:text-[#a3a3a3]'
                }`}
              >
                All ({articles.length})
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'published'
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-[#666666] dark:text-[#a3a3a3]'
                }`}
              >
                Published ({publishedCount})
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'draft'
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-[#666666] dark:text-[#a3a3a3]'
                }`}
              >
                Drafts ({draftCount})
              </button>
            </div>

            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-xs font-bold text-[#1a1a1a] dark:text-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles Table / List */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#141414]">
            <p className="text-sm text-[#666666] dark:text-[#a3a3a3] font-medium mb-4">
              No articles found matching your criteria.
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
            {/* Desktop Table */}
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
              This action cannot be undone. The article and its clean URL will be removed.
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
