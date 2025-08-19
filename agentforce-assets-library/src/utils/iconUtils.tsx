'use client';

import {
  House,
  Package,
  Grid,
  Search,
  X,
  Menu,
  Star,
  ExternalLink,
  Clipboard,
  Check,
  ChevronRight,
  Sparkles,
  Sparkles2,
  BotSquare
} from '@deemlol/next-icons';

export const IconHome = () => <House className="w-5 h-5" />;
export const IconProducts = () => <Package className="w-5 h-5" />;
export const IconIndustries = () => <Grid className="w-5 h-5" />;
export const IconSearch = () => <Search className="w-5 h-5" />;
export const IconClose = () => <X className="w-5 h-5" />;
export const IconMenu = () => <Menu className="w-6 h-6" />;
export const IconStar = () => <Star className="w-4 h-4" />;
export const IconExternalLink = () => <ExternalLink className="w-4 h-4" />;
export const IconCopy = () => <Clipboard className="h-5 w-5 text-white/70" />;
export const IconCopied = () => <Check className="h-5 w-5 text-green-400" />;
export const IconArrow = () => <ChevronRight className="w-4 h-4" />;

// Asset type icons
export const IconAction = () => <Sparkles className="w-full h-full text-white" />;
export const IconTopic = () => <Sparkles2 className="w-full h-full text-white" />;
export const IconAgent = () => <BotSquare className="w-full h-full text-white" />;
