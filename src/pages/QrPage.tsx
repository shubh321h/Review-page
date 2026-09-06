import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'qrcode'
import {
  ArrowLeft,
  Download,
  Printer,
  MessageSquareQuote,
  Star,
  ScanLine,
} from 'lucide-react'
import { BUSINESS, GOOGLE_REVIEW_URL } from '../lib/data'
import { copyText } from '../lib/clipboard'
import { Shell, Step, Brand, PrimaryButton, GhostButton, Note } from '../components/ui'

const QR_COLOR = { dark: '#0b1020', light: '#ffffff' }

export default function QrPage() {
  const [svg, setSvg] = useState('')
  const [copied, setCopied] = useState<'idle' | 'ok'>('idle')

  const target = BUSINESS.reviewPage

  useEffect(() => {
    let alive = true
    QRCode.toString(target, {
      type: 'svg',
      margin: 1,
      width: 360,
      errorCorrectionLevel: 'M',
      color: QR_COLOR,
    })
      .then((s) => {
        if (alive) setSvg(s)
      })
      .catch(() => {
        if (alive) setSvg('')
      })
    return () => {
      alive = false
    }
  }, [target])

  const downloadPng = async () => {
    try {
      const url = await QRCode.toDataURL(target, {
        width: 1600,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: QR_COLOR,
      })
      const a = document.createElement('a')
      a.href = url
      a.download = 'saket-review-qr.png'
      a.click()
    } catch {
      /* noop */
    }
  }

  const downloadSvg = () => {
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'saket-review-qr.svg'
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1500)
  }

  const copyLink = async () => {
    const ok = await copyText(GOOGLE_REVIEW_URL)
    setCopied(ok ? 'ok' : 'idle')
    setTimeout(() => setCopied('idle'), 1800)
  }

  const steps = [
    'They pick a star rating.',
    'They choose the service and what they liked.',
    'A unique, natural review is written for them to edit.',
    'Their Google review page opens with the text ready to paste.',
    'They tap Post themselves — you never post for them.',
  ]

  return (
    <Shell>
      <Step k="qr">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="tap flex items-center gap-1.5 text-[12.5px] font-semibold text-mist transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <Brand compact />
        </div>

        <h1 className="mt-7 text-[30px] leading-[1.08] font-semibold tracking-[-0.02em] text-white">
          Your permanent
          <br />
          review QR code
        </h1>
        <p className="mt-2.5 text-[14px] leading-relaxed text-mist">
          Print it once and keep it forever — stick it on the truck, the invoices, the visiting cards and the packing
          sheets.
        </p>

        <div
          id="qr-print"
          className="mt-6 rounded-[30px] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(245,184,65,0.6)]"
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-full [&>svg]:h-auto [&>svg]:w-full"
              aria-label="QR code linking to the review page"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0b1020]">
              Scan &middot; Rate &middot; Review
            </p>
            <p className="text-center text-[10.5px] font-semibold text-[#0b1020]/55">
              {BUSINESS.name} &middot; Google Reviews
            </p>
            <p className="text-center text-[10px] leading-relaxed font-medium text-[#0b1020]/45">
              Open your camera, scan the code, and tell us how we did.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-mist">
            <MessageSquareQuote className="h-3.5 w-3.5 text-gold" /> This code always opens
          </p>
          <div className="rounded-2xl border border-line bg-white/[0.04] px-3.5 py-3.5">
            <p className="break-all text-[13px] leading-relaxed text-white/85">{target}</p>
          </div>
          <div className="mt-2.5">
            <Note>
              Fixed on purpose — print it once and it keeps working. The page only opens from this address or the QR
              code.
            </Note>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <PrimaryButton onClick={downloadPng} icon={<Download className="h-4 w-4" />}>
            PNG
          </PrimaryButton>
          <PrimaryButton onClick={downloadSvg} icon={<Download className="h-4 w-4" />}>
            SVG
          </PrimaryButton>
        </div>
        <div className="mt-2.5">
          <GhostButton onClick={() => window.print()} icon={<Printer className="h-4 w-4" />}>
            Print at any size
          </GhostButton>
        </div>

        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-[18px] font-semibold text-white">
            <ScanLine className="h-4 w-4 text-gold" /> After a customer scans
          </h2>
          <ol className="mt-3 space-y-2">
            {steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 rounded-2xl border border-line bg-white/[0.03] p-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-[12px] font-extrabold text-gold">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-[13px] leading-relaxed text-mist">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-[18px] font-semibold text-white">
            <Star className="h-4 w-4 text-gold" /> Your direct Google review link
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-mist">
            Handy for WhatsApp replies, invoices and message signatures.
          </p>
          <div className="mt-3 rounded-2xl border border-line bg-white/[0.04] px-3.5 py-3.5">
            <p className="break-all text-[12.5px] leading-relaxed text-white/80">{GOOGLE_REVIEW_URL}</p>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <PrimaryButton onClick={copyLink} icon={<Download className="h-4 w-4" />}>
              {copied === 'ok' ? 'Copied' : 'Copy link'}
            </PrimaryButton>
            <GhostButton
              onClick={() => window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer')}
              icon={<ArrowLeft className="h-4 w-4 rotate-180" />}
            >
              Open Google Reviews
            </GhostButton>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-semibold text-mist/60">
          <Star className="h-3 w-3 fill-gold text-gold" /> {BUSINESS.name} &middot; Ayodhya
        </div>
      </Step>
    </Shell>
  )
}
