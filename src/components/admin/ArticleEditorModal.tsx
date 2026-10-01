import React, { useState, useEffect } from 'react';
import {
  X,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Eye,
  Edit3,
  Upload,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Globe
} from 'lucide-react';
import { Article, ArticleStatus } from '../../types/blog';
import { generateSlug, calculateReadingTime, INITIAL_CATEGORIES } from '../../services/articleStorage';
import { optimizeImageFile, storeImageBlob, PRESET_IMAGES } from '../../services/imageStorage';
import { RichContentRenderer } from '../blog/RichContentRenderer';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Partial<Article> & { title: string }) => Promise<void>;
  initialArticle?: Article | null;
}

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'seo'>('write');
  const [imageTab, setImageTab] = useState<'presets' | 'upload' | 'url'>('presets');

  // Article state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('SEO Strategy');
  const [customCategory, setCustomCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [imageAlt, setImageAlt] = useState(PRESET_IMAGES[0].altText);
  const [imageCaption, setImageCaption] = useState('');
  const [takeaways, setTakeaways] = useState<string[]>(['']);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState<ArticleStatus>('published');

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serpView, setSerpView] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (initialArticle) {
      setTitle(initialArticle.title);
      setSlug(initialArticle.slug);
      setCategory(initialArticle.category);
      setExcerpt(initialArticle.excerpt);
      setContent(initialArticle.content);
      setImageUrl(initialArticle.featuredImage?.url || PRESET_IMAGES[0].url);
      setImageAlt(initialArticle.featuredImage?.altText || '');
      setImageCaption(initialArticle.featuredImage?.caption || '');
      setTakeaways(initialArticle.takeaways && initialArticle.takeaways.length > 0 ? initialArticle.takeaways : ['']);
      setSeoTitle(initialArticle.seoTitle || initialArticle.title);
      setSeoDescription(initialArticle.seoDescription || initialArticle.excerpt);
      setStatus(initialArticle.status);
    } else {
      // New article reset
      setTitle('');
      setSlug('');
      setCategory('SEO Strategy');
      setExcerpt('');
      setContent('');
      setImageUrl(PRESET_IMAGES[0].url);
      setImageAlt(PRESET_IMAGES[0].altText);
      setImageCaption('');
      setTakeaways(['']);
      setSeoTitle('');
      setSeoDescription('');
      setStatus('published');
    }
    setActiveTab('write');
  }, [initialArticle, isOpen]);

  // Auto slug generator when typing title (unless manually edited)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialArticle || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
    if (!seoTitle || seoTitle === title) {
      setSeoTitle(val);
    }
  };

  const handleExcerptChange = (val: string) => {
    setExcerpt(val);
    if (!seoDescription || seoDescription === excerpt) {
      setSeoDescription(val);
    }
  };

  // Content formatting toolbar helpers
  const insertFormatting = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  // Image Upload handler with canvas compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      setIsUploading(true);
      const optimized = await optimizeImageFile(file, 1200, 800, 0.82);
      const imageId = `img_${Date.now()}`;
      await storeImageBlob(imageId, optimized.blob, file.type);
      setImageUrl(optimized.dataUrl);
      if (!imageAlt) {
        setImageAlt(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to compress image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Takeaways handlers
  const handleAddTakeaway = () => {
    setTakeaways([...takeaways, '']);
  };

  const handleTakeawayChange = (idx: number, val: string) => {
    const updated = [...takeaways];
    updated[idx] = val;
    setTakeaways(updated);
  };

  const handleRemoveTakeaway = (idx: number) => {
    setTakeaways(takeaways.filter((_, i) => i !== idx));
  };

  // Save submit
  const handleSubmit = async (submitStatus: ArticleStatus) => {
    if (!title.trim()) {
      alert('Please enter an article title');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalCategory = category === 'custom' ? (customCategory.trim() || 'SEO Strategy') : category;
      const finalSlug = slug.trim() || generateSlug(title);
      const cleanTakeaways = takeaways.map((t) => t.trim()).filter(Boolean);

      await onSave({
        id: initialArticle?.id,
        title: title.trim(),
        slug: finalSlug,
        category: finalCategory,
        excerpt: excerpt.trim() || title.trim(),
        content: content.trim(),
        featuredImage: {
          url: imageUrl,
          altText: imageAlt.trim() || title.trim(),
          caption: imageCaption.trim() || undefined,
        },
        status: submitStatus,
        readingTime: calculateReadingTime(content),
        seoTitle: seoTitle.trim() || title.trim(),
        seoDescription: seoDescription.trim() || excerpt.trim() || title.trim(),
        takeaways: cleanTakeaways,
      });

      onClose();
    } catch (err) {
      console.error('Failed to save article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#141414] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#e5e5e5] dark:border-[#262626] relative my-6 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5] dark:border-[#262626] shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1a1a1a] dark:text-white">
              {initialArticle ? 'Edit SEO Article' : 'Create New Article'}
            </h2>
            <p className="text-xs text-[#666666] dark:text-[#a3a3a3]">
              Draft, optimize, and publish high-ranking insights
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-[#e5e5e5] dark:border-[#262626] shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('write')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'write'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'text-[#666666] dark:text-[#a3a3a3] hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Content & Details</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'preview'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'text-[#666666] dark:text-[#a3a3a3] hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'seo'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'text-[#666666] dark:text-[#a3a3a3] hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>SEO & SERP Preview</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 py-6 space-y-6 pr-1">
          {activeTab === 'write' && (
            <>
              {/* Title & Slug */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-neutral-200 mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Search Intent Over Keyword Density: Why Modern SEO Rewards Clarity"
                    className="w-full px-4 py-3 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] text-base font-bold text-[#1a1a1a] dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-[#a3a3a3] mb-1.5">
                      Clean URL Slug
                    </label>
                    <div className="flex items-center rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] px-3.5 py-2 text-xs font-mono text-[#666666] dark:text-[#a3a3a3]">
                      <span>/blog/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="article-slug"
                        className="w-full bg-transparent text-[#1a1a1a] dark:text-white font-bold focus:outline-none ml-0.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-[#a3a3a3] mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] text-xs font-bold text-[#1a1a1a] dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                    >
                      {INITIAL_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="custom">+ Add Custom Category</option>
                    </select>

                    {category === 'custom' && (
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter category name"
                        className="mt-2 w-full px-3 py-2 text-xs rounded-lg border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] text-[#1a1a1a] dark:text-white"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-neutral-200 mb-1.5">
                  Short Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => handleExcerptChange(e.target.value)}
                  placeholder="Provide a concise 1-2 sentence hook for cards and previews..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] text-xs sm:text-sm text-[#1a1a1a] dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Featured Image Management */}
              <div className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white">
                    Featured Image
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageTab('presets')}
                      className={`px-2.5 py-1 rounded ${
                        imageTab === 'presets'
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'text-[#666666] dark:text-[#a3a3a3]'
                      }`}
                    >
                      SEO Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-2.5 py-1 rounded ${
                        imageTab === 'upload'
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'text-[#666666] dark:text-[#a3a3a3]'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-2.5 py-1 rounded ${
                        imageTab === 'url'
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'text-[#666666] dark:text-[#a3a3a3]'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {imageTab === 'presets' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {PRESET_IMAGES.map((preset) => {
                      const isSelected = imageUrl === preset.url;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            setImageUrl(preset.url);
                            setImageAlt(preset.altText);
                          }}
                          className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-black dark:border-white ring-2 ring-black/20'
                              : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-full h-20 object-cover"
                          />
                          <div className="p-1.5 bg-black/80 text-white text-[10px] font-bold truncate">
                            {preset.title}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {imageTab === 'upload' && (
                  <div className="p-4 border-2 border-dashed border-[#e5e5e5] dark:border-[#333] rounded-xl text-center space-y-2">
                    <input
                      type="file"
                      id="image-file-upload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-file-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold cursor-pointer hover:opacity-90"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Optimizing Image...' : 'Choose Image to Optimize & Upload'}</span>
                    </label>
                    <p className="text-[11px] text-[#666666] dark:text-[#a3a3a3]">
                      Automatically compressed using HTML5 Canvas to keep article data lightweight.
                    </p>
                    {uploadSuccess && (
                      <p className="text-xs font-bold text-emerald-500">Image optimized and saved!</p>
                    )}
                  </div>
                )}

                {imageTab === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#141414] text-[#1a1a1a] dark:text-white"
                    />
                  </div>
                )}

                {/* Alt text & Caption */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#666666] dark:text-[#a3a3a3] mb-1">
                      Alt Text (Crucial for SEO) *
                    </label>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Describe the image content accurately..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#141414] text-[#1a1a1a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#666666] dark:text-[#a3a3a3] mb-1">
                      Optional Caption
                    </label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Visible caption below image"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e5e5e5] dark:border-[#262626] bg-white dark:bg-[#141414] text-[#1a1a1a] dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor with Formatting Toolbar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-neutral-200">
                    Article Body *
                  </label>
                  <span className="text-[11px] text-[#666666] dark:text-[#a3a3a3]">
                    {calculateReadingTime(content)} • {content.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded-t-xl text-[#1a1a1a] dark:text-[#ededed]">
                  <button
                    type="button"
                    title="Heading 2"
                    onClick={() => insertFormatting('## ', '\n', 'Heading')}
                    className="p-1.5 hover:bg-white dark:hover:bg-[#222] rounded transition-colors"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Heading 3"
                    onClick={() => insertFormatting('### ', '\n', 'Subheading')}
                    className="p-1.5 hover:bg-white dark:hover:bg-[#222] rounded transition-colors"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-[#e5e5e5] dark:bg-[#333] mx-1" />
                  <button
                    type="button"
                    title="Bold"
                    onClick={() => insertFormatting('**', '**', 'bold text')}
                    className="p-1.5 hover:bg-white dark:hover:bg-[#222] rounded transition-colors"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Italic"
                    onClick={() => insertFormatting('*', '*', 'italic text')}
                    className="p-1.5 hover:bg-white dark:hover:bg-[#222] rounded transition-colors"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-[#e5e5e5] dark:bg-[#333] mx-1" />
                  <button
                    type="button"
                    title="Bullet List"
                    onClick={() => insertFormatting('- ', '\n', 'List item')}
                    className="p-1.5 hover:bg-white dark:hover:bg-[#222] rounded transition-colors"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Numbered List"
                    onClick={() => insertFormatting('1. ', '\n', 'First item')}
                    className="p-1.5 hover:bg-white dark:hover:bg-[#222] rounded transition-colors"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Blockquote"
                    onClick={() => insertFormatting('> ', '\n', 'Actionable takeaway or quote')}
                    className="p-1.5 hover:bg-white dark:hover:bg-[#222] rounded transition-colors"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-[#e5e5e5] dark:bg-[#333] mx-1" />
                  <button
                    type="button"
                    title="Link"
                    onClick={() => insertFormatting('[', '](https://example.com)', 'anchor text')}
                    className="p-1.5 hover:bg-white dark:hover:bg-[#222] rounded transition-colors"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Embed Image"
                    onClick={() => insertFormatting('![SEO Visual](', ')', 'https://images.unsplash.com/...')}
                    className="p-1.5 hover:bg-white dark:hover:bg-[#222] rounded transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  id="article-content-textarea"
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste or write your SEO article here... Use the toolbar for clean headings, bullet lists, blockquotes, and links."
                  className="w-full p-4 rounded-b-xl border border-t-0 border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] font-mono text-xs sm:text-sm text-[#1a1a1a] dark:text-white leading-relaxed focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Core Actionable Takeaways */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-neutral-200">
                    Core Actionable Takeaways
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTakeaway}
                    className="inline-flex items-center gap-1 text-xs font-bold text-black dark:text-white hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Point</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {takeaways.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                        placeholder={`Takeaway point #${idx + 1}`}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] text-[#1a1a1a] dark:text-white"
                      />
                      {takeaways.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTakeaway(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'preview' && (
            <div className="p-6 rounded-2xl bg-[#fafafa] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] space-y-6">
              <div className="border-b border-[#e5e5e5] dark:border-[#262626] pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white dark:text-black bg-black dark:bg-white px-2.5 py-0.5 rounded">
                  {category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] dark:text-white mt-3">
                  {title || 'Untitled Article'}
                </h1>
                <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a3a3a3] mt-2">
                  {excerpt}
                </p>
              </div>

              {imageUrl && (
                <div className="rounded-xl overflow-hidden max-h-72">
                  <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
                </div>
              )}

              <RichContentRenderer content={content} />
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* SERP Preview */}
              <div className="p-5 rounded-2xl bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-black dark:text-white" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white">
                      Google Search Result Snippet Preview
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setSerpView('desktop')}
                      className={`px-2 py-0.5 rounded ${
                        serpView === 'desktop'
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'text-[#666666] dark:text-[#a3a3a3]'
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setSerpView('mobile')}
                      className={`px-2 py-0.5 rounded ${
                        serpView === 'mobile'
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'text-[#666666] dark:text-[#a3a3a3]'
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                {/* Google Card Simulation */}
                <div className={`p-4 bg-white dark:bg-[#111111] rounded-xl border border-[#e5e5e5] dark:border-[#262626] font-sans ${
                  serpView === 'mobile' ? 'max-w-sm mx-auto' : ''
                }`}>
                  <div className="flex items-center gap-2 text-xs text-[#202124] dark:text-[#bdc1c6] mb-1">
                    <div className="w-4 h-4 rounded-full bg-black text-white text-[9px] font-black flex items-center justify-center">
                      F
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium leading-none text-[#202124] dark:text-[#dadce0]">
                        fiorella-seo.com
                      </span>
                      <span className="text-[10px] text-[#4d5156] dark:text-[#9aa0a6] leading-none mt-0.5">
                        https://fiorella-seo.com › blog › {slug || 'article-slug'}
                      </span>
                    </div>
                  </div>

                  <div className="text-base sm:text-lg text-[#1a0dab] dark:text-[#8ab4f8] hover:underline font-medium cursor-pointer leading-tight my-1">
                    {seoTitle || title || 'Article Title - SEO Portfolio'}
                  </div>

                  <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
                    {seoDescription || excerpt || 'Article description appearing directly in search engine snippets.'}
                  </p>
                </div>
              </div>

              {/* SEO Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white">
                    SEO Meta Title
                  </label>
                  <span className={`text-[11px] font-mono ${
                    seoTitle.length > 60 ? 'text-amber-500 font-bold' : 'text-[#666666] dark:text-[#a3a3a3]'
                  }`}>
                    {seoTitle.length}/60 chars (Recommended: 30-60)
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Primary keyword first - Brand Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] text-xs sm:text-sm text-[#1a1a1a] dark:text-white"
                />
              </div>

              {/* SEO Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white">
                    Meta Description
                  </label>
                  <span className={`text-[11px] font-mono ${
                    seoDescription.length > 160 ? 'text-amber-500 font-bold' : 'text-[#666666] dark:text-[#a3a3a3]'
                  }`}>
                    {seoDescription.length}/160 chars (Recommended: 120-160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Include your primary target keyword, summarize content, and include a call to action..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] text-xs sm:text-sm text-[#1a1a1a] dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#262626] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#666666] dark:text-[#a3a3a3]">Status:</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              status === 'published'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
            }`}>
              {status}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2.5 rounded-full border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] hover:border-black dark:hover:border-white text-xs font-bold text-[#1a1a1a] dark:text-[#ededed] transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('published')}
              className="px-6 py-2.5 rounded-full bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-xs font-bold text-white dark:text-black transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Publish Article'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
