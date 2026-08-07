'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCampaign } from '@/lib/actions/campaign';
import { uploadToImgBB } from '@/lib/imgbb';
import {
    FiUploadCloud,
    FiLink,
    FiTrash2,
    FiPlusCircle,
    FiDollarSign,
    FiCalendar,
    FiGift,
    FiFolder,
    FiFileText,
    FiTag,
    FiCheckCircle,
    FiAlertCircle,
    FiChevronDown
} from 'react-icons/fi';
import { Button, Card, Input, TextArea, Select, Label, ListBox } from '@heroui/react';
import { useSession } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const CATEGORIES = [
    { key: 'technology', label: 'Technology' },
    { key: 'art', label: 'Art' },
    { key: 'community', label: 'Community' },
    { key: 'health', label: 'Health' },
    { key: 'education', label: 'Education' },
    { key: 'environment', label: 'Environment' }
];

export default function AddCampaignPage() {
    const { data: session } = useSession();
    const user = session?.user;

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        campaign_title: '',
        campaign_story: '',
        category: '',
        funding_goal: '',
        minimum_Contribution: '',
        deadline: '',
        reward_info: ''
    });

    const [imageInputMode, setImageInputMode] = useState('upload');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    // Get today's date formatted as YYYY-MM-DD for date input minimum constraint
    const todayDateStr = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategorySelection = (keys) => {
        const selectedKey = keys instanceof Set ? Array.from(keys)[0] : keys;

        if (selectedKey) {
            setFormData((prev) => ({
                ...prev,
                category: String(selectedKey).toLowerCase(),
            }));
        }
    };
    const handleFileSelect = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            setErrorMsg('Please select or paste a valid image file.');
            return;
        }
        setErrorMsg('');
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handlePaste = (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    handleFileSelect(file);
                    break;
                }
            }
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        setImagePreview(url);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImageUrl('');
        setImagePreview('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        // Basic Field Validations
        if (
            !formData.campaign_title.trim() ||
            !formData.campaign_story.trim() ||
            !formData.category ||
            !formData.funding_goal ||
            !formData.deadline
        ) {
            setErrorMsg('Please fill in all required fields.');
            return;
        }

        if (Number(formData.funding_goal) <= 0) {
            setErrorMsg('Funding goal must be greater than 0.');
            return;
        }

        let finalImageUrl = imageUrl.trim() || 'https://i.ibb.co.com/ksKTC715/image.png';

        setLoading(true);

        try {
            // Upload file to ImgBB if local file is selected
            if (imageFile) {
                setUploadingImage(true);
                try {
                    finalImageUrl = await uploadToImgBB(imageFile);
                } catch (err) {
                    throw new Error('Image upload failed: ' + err.message);
                } finally {
                    setUploadingImage(false);
                }
            }

            if (!finalImageUrl) {
                throw new Error('Please upload an image or provide a valid image URL.');
            }

            // Construct payload matching exact database schema
            const payload = {
                campaign_title: formData.campaign_title.trim(),
                campaign_story: formData.campaign_story.trim(),
                category: formData.category,
                funding_goal: Number(formData.funding_goal),
                minimum_Contribution: Number(formData.minimum_Contribution) || 0,
                deadline: formData.deadline,
                reward_info: formData.reward_info.trim(),
                campaign_image_url: finalImageUrl,
                userId: user?.id || '6a71fa0522c0c42d4657fc1b',
                creatorName: user?.name || 'Creator',
                creatorEmail: user?.email || 'creator2@gmail.com',
                creatorProfileImg: user?.image || 'https://i.ibb.co/YKkGFr1/Screenshot-2025-03-18-022024.png',
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            const result = await createCampaign(payload);

            if (result?.insertedId || result?.acknowledged) {
                setSuccessMsg('Campaign created successfully! Redirecting to dashboard...');
                toast.success('Campaign Added Successfully!');
                setTimeout(() => {
                    router.push('/dashboard/creator/my-campaigns');
                }, 1500);
            } else {
                throw new Error(result?.message || 'Failed to create campaign.');
            }
        } catch (err) {
            toast.error(`Something went wrong || ${err.message}`)
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-neutral-900 dark:text-neutral-100 transition-colors">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 dark:from-primary-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Create a New Campaign
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto text-sm sm:text-base">
                        Share your vision, set your goals, and inspire Supporters to bring your ideas to life.
                    </p>
                </div>

                {errorMsg && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 text-danger dark:bg-danger-900/30 dark:text-danger-400 border border-danger-200 dark:border-danger-800 animate-fade-in">
                        <FiAlertCircle className="text-xl flex-shrink-0" />
                        <p className="text-sm font-medium">{errorMsg}</p>
                    </div>
                )}

                {successMsg && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-success-50 text-success dark:bg-success-900/30 dark:text-success-400 border border-success-200 dark:border-success-800 animate-fade-in">
                        <FiCheckCircle className="text-xl flex-shrink-0" />
                        <p className="text-sm font-medium">{successMsg}</p>
                    </div>
                )}

                <Card className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-xl border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-8">
                    <div className="p-4 sm:p-8">
                        <form onSubmit={handleSubmit} onPaste={handlePaste} className="space-y-6">

                            {/* Campaign Title & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                        Campaign Title <span className="text-danger">*</span>
                                    </Label>
                                    <div className="relative flex items-center">
                                        <FiTag className="absolute left-3 text-neutral-400 z-10 pointer-events-none" />
                                        <Input
                                            aria-label="Campaign Title"
                                            placeholder="ex: Help us build a solar-powered water pump"
                                            name="campaign_title"
                                            value={formData.campaign_title}
                                            onChange={handleChange}
                                            required
                                            variant="bordered"
                                            className="pl-8 dark:bg-neutral-800/50 dark:border-neutral-700 w-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                        Category <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        aria-label="Campaign Category"
                                        selectedKeys={formData.category ? new Set([formData.category]) : new Set()}
                                        onSelectionChange={handleCategorySelection}
                                        placeholder="Select category"
                                    >
                                        <Select.Trigger aria-label="Select category dropdown" className="w-full flex items-center justify-between px-3 py-2 border rounded-xl border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800/50">
                                            <div className="flex items-center gap-2">
                                                <FiFolder className="text-neutral-400" />
                                                <Select.Value placeholder="Select category" />
                                            </div>
                                            <Select.Indicator>
                                                <FiChevronDown className="text-neutral-400" />
                                            </Select.Indicator>
                                        </Select.Trigger>

                                        <Select.Popover className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg p-1 z-50">
                                            <ListBox aria-label="Campaign Categories">
                                                {CATEGORIES.map((cat) => (
                                                    <ListBox.Item
                                                        key={cat.key}
                                                        id={cat.key} /* <-- ADD THIS EXACT PROP */
                                                        textValue={cat.label}
                                                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
                                                    >
                                                        <Label className="cursor-pointer">{cat.label}</Label>
                                                    </ListBox.Item>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </div>
                            </div>

                            {/* Campaign Story */}
                            <div>
                                <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                    Campaign Story <span className="text-danger">*</span>
                                </Label>
                                <div className="relative">
                                    <FiFileText className="absolute left-3 top-3 text-neutral-400 z-10 pointer-events-none" />
                                    <TextArea
                                        aria-label="Campaign Story"
                                        placeholder="Provide a detailed description of your campaign, your mission, and how funds will be used..."
                                        name="campaign_story"
                                        value={formData.campaign_story}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        variant="bordered"
                                        className="pl-8 dark:bg-neutral-800/50 dark:border-neutral-700 w-full"
                                    />
                                </div>
                            </div>

                            {/* Goal, Minimum Contribution, & Deadline */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                        Funding Goal (Credits) <span className="text-danger">*</span>
                                    </Label>
                                    <div className="relative flex items-center">
                                        <FiDollarSign className="absolute left-3 text-neutral-400 z-10 pointer-events-none" />
                                        <Input
                                            type="number"
                                            aria-label="Funding Goal (Credits)"
                                            placeholder="e.g. 5000"
                                            name="funding_goal"
                                            value={formData.funding_goal}
                                            onChange={handleChange}
                                            required
                                            min={1}
                                            variant="bordered"
                                            className="pl-8 dark:bg-neutral-800/50 dark:border-neutral-700 w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                        Minimum Contribution <span className="text-danger">*</span>
                                    </Label>
                                    <div className="relative flex items-center">
                                        <FiDollarSign className="absolute left-3 text-neutral-400 z-10 pointer-events-none" />
                                        <Input
                                            type="number"
                                            aria-label="Minimum Contribution"
                                            placeholder="e.g. 10"
                                            name="minimum_Contribution"
                                            value={formData.minimum_Contribution}
                                            onChange={handleChange}
                                            required
                                            min={1}
                                            variant="bordered"
                                            className="pl-8 dark:bg-neutral-800/50 dark:border-neutral-700 w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                        Deadline <span className="text-danger">*</span>
                                    </Label>
                                    <div className="relative flex items-center">
                                        <FiCalendar className="absolute left-3 text-neutral-400 z-10 pointer-events-none" />
                                        <Input
                                            type="date"
                                            aria-label="Deadline"
                                            name="deadline"
                                            value={formData.deadline}
                                            onChange={handleChange}
                                            min={todayDateStr}
                                            required
                                            variant="bordered"
                                            className="pl-8 dark:bg-neutral-800/50 dark:border-neutral-700 w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Reward Info */}
                            <div>
                                <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                    Reward Info
                                </Label>
                                <div className="relative">
                                    <FiGift className="absolute left-3 top-3 text-neutral-400 z-10 pointer-events-none" />
                                    <TextArea
                                        aria-label="Reward Info"
                                        placeholder="Describe what Supporters will receive for pledging (perks, early access, shoutouts)..."
                                        name="reward_info"
                                        value={formData.reward_info}
                                        onChange={handleChange}
                                        rows={2}
                                        variant="bordered"
                                        className="pl-8 dark:bg-neutral-800/50 dark:border-neutral-700 w-full"
                                    />
                                </div>
                            </div>

                            {/* Image Input Section */}
                            <div className="space-y-3 pt-2">
                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                    Campaign Cover Image <span className="text-danger">*</span>
                                </label>

                                <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                                    <button
                                        type="button"
                                        onClick={() => setImageInputMode('upload')}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${imageInputMode === 'upload'
                                            ? 'bg-primary-500 text-white shadow-md'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                            }`}
                                    >
                                        <FiUploadCloud /> Upload / Paste Image
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageInputMode('url')}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${imageInputMode === 'url'
                                            ? 'bg-primary-500 text-white shadow-md'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                            }`}
                                    >
                                        <FiLink /> Direct Image URL
                                    </button>
                                </div>

                                {imagePreview ? (
                                    <div className="relative group rounded-2xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 max-h-72 flex items-center justify-center">
                                        <img
                                            src={imagePreview}
                                            alt="Campaign cover preview"
                                            className="w-full h-64 object-cover"
                                            onError={() => setErrorMsg('Failed to load image preview from URL.')}
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <Button
                                                color="danger"
                                                variant="flat"
                                                size="sm"
                                                onPress={handleRemoveImage}
                                                className="flex items-center gap-2"
                                            >
                                                <FiTrash2 />
                                                Remove Image
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {imageInputMode === 'upload' ? (
                                            <div
                                                onDragOver={handleDragOver}
                                                onDrop={handleDrop}
                                                className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-400 rounded-2xl p-8 text-center bg-neutral-50/50 dark:bg-neutral-800/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-3"
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="campaign_image_file"
                                                    className="hidden"
                                                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                                />
                                                <label htmlFor="campaign_image_file" className="cursor-pointer flex flex-col items-center gap-2">
                                                    <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-500">
                                                        <FiUploadCloud className="text-3xl" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                                            Click to upload, drag and drop, or paste (Ctrl+V) an image
                                                        </p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                            PNG, JPG, WEBP or GIF (Uploaded via ImgBB)
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="relative flex items-center">
                                                <FiLink className="absolute left-3 text-neutral-400 z-10 pointer-events-none" />
                                                <Input
                                                    type="url"
                                                    aria-label="Direct Image URL"
                                                    placeholder="https://example.com/image.jpg"
                                                    value={imageUrl}
                                                    onChange={handleUrlChange}
                                                    variant="bordered"
                                                    className="pl-8 dark:bg-neutral-800/50 dark:border-neutral-700 w-full"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    color="primary"
                                    size="lg"
                                    isLoading={loading}
                                    isDisabled={loading}
                                    className="w-full font-semibold bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {!loading && <FiPlusCircle className="text-lg" />}
                                    {loading
                                        ? uploadingImage
                                            ? 'Uploading Image...'
                                            : 'Creating Campaign...'
                                        : 'Submit Campaign'}
                                </Button>
                            </div>

                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}