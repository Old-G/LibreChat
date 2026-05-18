import { ExternalLink } from 'lucide-react';
import {
  OGDialog,
  OGDialogContent,
  OGDialogHeader,
  OGDialogTitle,
} from '@librechat/client';
import { useLocalize } from '~/hooks';

const MIRON_VERSION = '0.1.0-mvp';
const LIBRECHAT_UPSTREAM_URL = 'https://github.com/danny-avila/LibreChat';
const LIBRECHAT_LICENSE_URL = 'https://github.com/danny-avila/LibreChat/blob/main/LICENSE';
const MIRON_REPO_URL = 'https://github.com/Old-G/miron';

interface AboutMironProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AboutMiron({ open, onOpenChange }: AboutMironProps) {
  const localize = useLocalize();

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent className="w-11/12 max-w-md">
        <OGDialogHeader>
          <OGDialogTitle>{localize('com_miron_about_title')}</OGDialogTitle>
        </OGDialogHeader>

        <div className="flex flex-col gap-5 px-2 pb-2 pt-1">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.svg"
              alt="Miron"
              className="h-12 w-12 select-none"
              draggable={false}
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-text-primary">Miron</span>
              <span className="text-xs text-text-tertiary">
                {localize('com_miron_about_version', { 0: MIRON_VERSION })}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-text-secondary">
            {localize('com_miron_about_tagline')}
          </p>

          <section className="flex flex-col gap-2 rounded-lg border border-border-light bg-surface-secondary px-3 py-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              {localize('com_miron_about_attribution_title')}
            </h4>
            <p className="text-sm text-text-secondary">
              {localize('com_miron_about_attribution_text')}
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-xs">
              <a
                href={LIBRECHAT_UPSTREAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                {localize('com_miron_about_link_librechat')}
              </a>
              <a
                href={LIBRECHAT_LICENSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                {localize('com_miron_about_link_license')}
              </a>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              {localize('com_miron_about_resources_title')}
            </h4>
            <a
              href={MIRON_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              {localize('com_miron_about_link_repo')}
            </a>
          </section>

          <p className="text-[11px] leading-snug text-text-tertiary">
            {localize('com_miron_about_disclaimer')}
          </p>
        </div>
      </OGDialogContent>
    </OGDialog>
  );
}
