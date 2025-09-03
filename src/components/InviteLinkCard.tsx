"use client";

import { useState, useEffect } from "react";
import { ReferralService } from "~/lib/referrals";
import SaveFileButton from "./SaveFileButton";
import Button from "./ui/Button";
import { generateReminderICS } from "~/lib/ics";

export default function InviteLinkCard() {
  const [inviteLink, setInviteLink] = useState("");
  const [linkSaved, setLinkSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    // Generate the invite link
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = ReferralService.getInviteLink(origin);
    setInviteLink(link);

    // Check if Web Share API is supported
    setShareSupported(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Apply to Talent Wharf',
      text: "I'm applying to Talent Wharf (invite-only for top uni engineers). Use my link to apply:",
      url: inviteLink,
    };

    if (shareSupported) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('Share cancelled or failed');
      }
    }
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `I'm applying to Talent Wharf (invite-only for top uni engineers). Use my link to apply: ${inviteLink}`
    );
    return `https://wa.me/?text=${text}`;
  };

  const getMailtoLink = () => {
    const subject = encodeURIComponent('Apply to Talent Wharf');
    const body = encodeURIComponent(
      `I'm applying to Talent Wharf (invite-only for top uni engineers). Use my link to apply: ${inviteLink}`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  };

  const handleSaveLink = () => {
    setLinkSaved(true);
  };

  const handleAddReminder = () => {
    const icsContent = generateReminderICS({
      title: 'Follow up on Talent Wharf referral',
      description: 'Check if anyone has used your Talent Wharf referral link',
      startInHours: 24,
    });
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'talent-wharf-reminder.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!inviteLink) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left space-y-4 mt-8">
      <h3 className="text-lg font-semibold text-gray-900">Your Personal Invite Link</h3>
      
      <p className="text-sm text-gray-600 leading-relaxed">
        Save and share your personal invite link. We use referrals to assess network quality—top talent 
        is surrounded by top talent. When one peer applies using your link, we&apos;ll email you that your 
        application is ready for review. We never contact your peers; they apply themselves.
      </p>

      <div className="bg-white border border-gray-200 rounded-md p-3 font-mono text-sm text-gray-700 break-all">
        {inviteLink}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="black"
          size="sm"
          onClick={handleCopyLink}
          className="flex-1 min-w-0"
          aria-describedby={copySuccess ? "copy-success" : undefined}
        >
          Copy Link
        </Button>

        {shareSupported ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            Share
          </Button>
        ) : (
          <div className="flex gap-2">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              WhatsApp
            </a>
            <a
              href={getMailtoLink()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Email
            </a>
          </div>
        )}

        <SaveFileButton
          filename="talent-wharf-invite.txt"
          content={`Your Talent Wharf invite link:\n${inviteLink}\n\nShare this with peers you'd recommend for top engineering roles.`}
          onSave={handleSaveLink}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Link
        </SaveFileButton>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddReminder}
        className="w-full text-xs"
      >
        📅 Add 24h Calendar Reminder
      </Button>

      {linkSaved && (
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
          <span>Personal link saved</span>
        </div>
      )}

      {/* Accessibility announcements */}
      <div aria-live="polite" className="sr-only">
        {copySuccess && <span id="copy-success">Link copied to clipboard</span>}
      </div>
    </div>
  );
}