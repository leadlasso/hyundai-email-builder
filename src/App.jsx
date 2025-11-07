import React, { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const dl = (filename, text) => {
  const blob = new Blob([text], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

function Field({ label, children }) {
  
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hyundai‑style Email Builder</h1>
          <p className="text-sm text-slate-600">Brand‑correct, 600px table layout. Export full HTML compatible with Gmail/Outlook.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">Split view</span>
          <button onClick={()=>setSplitView(!splitView)} className={`rounded-2xl px-3 py-1.5 text-sm border ${splitView?'bg-black text-white border-black':'bg-white text-black'}`}>
            {splitView ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {splitView ? (
        <div ref={containerRef} className="flex gap-4 items-stretch">
          {/* Left: resizable options */}
          <div className="space-y-3 min-w-[260px] max-w-[600px]" style={{width: `${splitWidth}%`}}>
            <Tabs defaultValue="content" className="w-full">
              <TabsList>
                <TabsTrigger tab="content">Content</TabsTrigger>
                <TabsTrigger tab="branding">Brand & Layout</TabsTrigger>
                <TabsTrigger tab="modules">Modules</TabsTrigger>
              </TabsList>

              <TabsContent when="content">
                <Card className="mt-3"><CardContent className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Subject line">
                      <Input value={meta.subjectLine} onChange={(e)=>setMeta({...meta, subjectLine:e.target.value})}/>
                    </Field>
                    <Field label="Preheader">
                      <Input value={meta.preheader} onChange={(e)=>setMeta({...meta, preheader:e.target.value})}/>
                    </Field>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Hero link URL">
                      <Input value={hero.href} onChange={(e)=>setHero({...hero, href:e.target.value})}/>
                    </Field>
                    <Field label="Hero image URL">
                      <Input value={hero.img} onChange={(e)=>setHero({...hero, img:e.target.value})}/>
                    </Field>
                    <Field label="Hero alt text">
                      <Input value={hero.alt} onChange={(e)=>setHero({...hero, alt:e.target.value})}/>
                    </Field>
                  </div>

                  <Field label="Intro paragraph (links to ‘website’ and ‘Instagram’ auto‑hyperlinked)">
                    <Textarea rows={3} value={intro.copy} onChange={(e)=>setIntro({...intro, copy:e.target.value})}/>
                  </Field>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Website URL"><Input value={intro.websiteHref} onChange={(e)=>setIntro({...intro, websiteHref:e.target.value})}/></Field>
                    <Field label="Instagram URL"><Input value={intro.instagramHref} onChange={(e)=>setIntro({...intro, instagramHref:e.target.value})}/></Field>
                    <Field label="Closing line"><Input value={intro.closing} onChange={(e)=>setIntro({...intro, closing:e.target.value})}/></Field>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Vehicle tiles</Label>
                      <div className="text-xs text-slate-500">Add up to 9 (renders 3 per row)</div>
                    </div>
                    <div className="space-y-3">
                      {vehicles.map((v, i) => (
                        <VehicleRow
                          key={i}
                          idx={i}
                          item={v}
                          onChange={(nv) => {
                            const copy = vehicles.slice();
                            copy[i] = nv;
                            setVehicles(copy);
                          }}
                          onRemove={() => {
                            const copy = vehicles.slice();
                            copy.splice(i, 1);
                            setVehicles(copy);
                          }}
                        />
                      ))}
                      <Button
                        onClick={() => setVehicles([...vehicles, { img: "", href: "" }])}
                        className="w-full"
                      >Add vehicle</Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="EV Headline image URL">
                      <Input value={ev.headlineImg} onChange={(e)=>setEv({...ev, headlineImg:e.target.value})}/>
                    </Field>
                    <Field label="EV Banner image URL">
                      <Input value={ev.bannerImg} onChange={(e)=>setEv({...ev, bannerImg:e.target.value})}/>
                    </Field>
                    <Field label="EV Banner link URL">
                      <Input value={ev.bannerHref} onChange={(e)=>setEv({...ev, bannerHref:e.target.value})}/>
                    </Field>
                  </div>
                </CardContent></Card>
              </TabsContent>

              <TabsContent when="branding">
                <Card className="mt-3"><CardContent className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Logo URL"><Input value={branding.logoUrl} onChange={(e)=>setBranding({...branding, logoUrl:e.target.value})}/></Field>
                    <Field label="Logo width (px)"><Input type="number" value={branding.logoWidth} onChange={(e)=>setBranding({...branding, logoWidth:parseInt(e.target.value||'0',10)})}/></Field>
                    <Field label="Brand page background"><Input value={branding.brandBg} onChange={(e)=>setBranding({...branding, brandBg:e.target.value})}/></Field>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Header background"><Input value={branding.headerBg} onChange={(e)=>setBranding({...branding, headerBg:e.target.value})}/></Field>
                    <Field label="Link color"><Input value={branding.linkColor} onChange={(e)=>setBranding({...branding, linkColor:e.target.value})}/></Field>
                    <Field label="Button BG"><Input value={branding.btnBg} onChange={(e)=>setBranding({...branding, btnBg:e.target.value})}/></Field>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Button text color"><Input value={branding.btnTextColor} onChange={(e)=>setBranding({...branding, btnTextColor:e.target.value})}/></Field>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Privacy URL"><Input value={footer.privacy} onChange={(e)=>setFooter({...footer, privacy:e.target.value})}/></Field>
                    <Field label="Unsubscribe URL"><Input value={footer.unsubscribe} onChange={(e)=>setFooter({...footer, unsubscribe:e.target.value})}/></Field>
                  </div>
                  <Field label="Legal block">
                    <Textarea rows={3} value={footer.legalBlock} onChange={(e)=>setFooter({...footer, legalBlock:e.target.value})}/>
                  </Field>
                </CardContent></Card>
              </TabsContent>

              <TabsContent when="modules">
                <Card className="mt-3"><CardContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show product grid</Label>
                      <div className="text-xs text-slate-500">3‑wide tiles built from your list</div>
                    </div>
                    <Switch checked={showProductGrid} onCheckedChange={setShowProductGrid} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1"><Label>Show EV section</Label></div>
                    <Switch checked={showEV} onCheckedChange={setShowEV} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1"><Label>Show shopping tools</Label></div>
                    <Switch checked={showShoppingTools} onCheckedChange={setShowShoppingTools} />
                  </div>
                </CardContent></Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Divider */}
          <div
            onMouseDown={startDrag}
            className="w-1.5 cursor-col-resize bg-slate-200 hover:bg-slate-300 rounded self-stretch"
            style={{userSelect: 'none'}}
            title="Drag to resize"
          ></div>

          {/* Right: preview flexes to fill */}
          <div className="flex-1">

        <div>
          <Tabs defaultValue="content" className="w-full">
            <TabsList>
              <TabsTrigger tab="content">Content</TabsTrigger>
              <TabsTrigger tab="branding">Brand & Layout</TabsTrigger>
              <TabsTrigger tab="modules">Modules</TabsTrigger>
              <TabsTrigger tab="preview">Preview / Export</TabsTrigger>
            </TabsList>

            <TabsContent when="content">
              
            </TabsContent>

            <TabsContent when="branding">
              
            </TabsContent>

            <TabsContent when="modules">
              
            </TabsContent>

            <TabsContent when="preview">

          <Card className="mt-3"><CardContent className="space-y-4 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-2xl bg-slate-100 p-1 gap-1">
                <button onClick={()=>setPreviewMode("desktop")} className={`px-3 py-1.5 text-sm rounded-xl ${previewMode==='desktop'?'bg-white shadow':'text-slate-600'}`}>Desktop 600px</button>
                <button onClick={()=>setPreviewMode("mobile")} className={`px-3 py-1.5 text-sm rounded-xl ${previewMode==='mobile'?'bg-white shadow':'text-slate-600'}`}>Mobile ~390px</button>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button onClick={() => navigator.clipboard.writeText(emailHTML)}>Copy HTML</Button>
                <Button variant="secondary" onClick={() => dl("hyundai-email.html", emailHTML)}>Download .html</Button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border shadow bg-white mx-auto" style={{width: previewMode==='mobile' ? 390 : 620}}>
              <div className="bg-slate-50 text-xs text-slate-600 px-3 py-1 border-b">Preview width: {previewMode==='mobile' ? '390px' : '620px (container 600px + padding)'}</div>
              <iframe title="preview" className="w-full h-[800px]" srcDoc={emailHTML} />
            </div>

            <details>
              <summary className="cursor-pointer text-sm text-slate-600">Show raw HTML</summary>
              <Textarea className="mt-2 font-mono" rows={14} value={emailHTML} readOnly />
            </details>
          </CardContent></Card>

            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

function VehicleRow({ idx, item, onChange, onRemove }) {
  
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hyundai‑style Email Builder</h1>
          <p className="text-sm text-slate-600">Brand‑correct, 600px table layout. Export full HTML compatible with Gmail/Outlook.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">Split view</span>
          <button onClick={()=>setSplitView(!splitView)} className={`rounded-2xl px-3 py-1.5 text-sm border ${splitView?'bg-black text-white border-black':'bg-white text-black'}`}>
            {splitView ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {splitView ? (
        <div className="grid grid-cols-12 gap-4">
          {/* Left: 25% options (tabs without preview) */}
          <div className="col-span-12 lg:col-span-3 space-y-3">
            <Tabs defaultValue="content" className="w-full">
              <TabsList>
                <TabsTrigger tab="content">Content</TabsTrigger>
                <TabsTrigger tab="branding">Brand & Layout</TabsTrigger>
                <TabsTrigger tab="modules">Modules</TabsTrigger>
              </TabsList>

              <TabsContent when="content">
                <Card className="mt-3"><CardContent className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Subject line">
                      <Input value={meta.subjectLine} onChange={(e)=>setMeta({...meta, subjectLine:e.target.value})}/>
                    </Field>
                    <Field label="Preheader">
                      <Input value={meta.preheader} onChange={(e)=>setMeta({...meta, preheader:e.target.value})}/>
                    </Field>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Hero link URL">
                      <Input value={hero.href} onChange={(e)=>setHero({...hero, href:e.target.value})}/>
                    </Field>
                    <Field label="Hero image URL">
                      <Input value={hero.img} onChange={(e)=>setHero({...hero, img:e.target.value})}/>
                    </Field>
                    <Field label="Hero alt text">
                      <Input value={hero.alt} onChange={(e)=>setHero({...hero, alt:e.target.value})}/>
                    </Field>
                  </div>

                  <Field label="Intro paragraph (links to ‘website’ and ‘Instagram’ auto‑hyperlinked)">
                    <Textarea rows={3} value={intro.copy} onChange={(e)=>setIntro({...intro, copy:e.target.value})}/>
                  </Field>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Website URL"><Input value={intro.websiteHref} onChange={(e)=>setIntro({...intro, websiteHref:e.target.value})}/></Field>
                    <Field label="Instagram URL"><Input value={intro.instagramHref} onChange={(e)=>setIntro({...intro, instagramHref:e.target.value})}/></Field>
                    <Field label="Closing line"><Input value={intro.closing} onChange={(e)=>setIntro({...intro, closing:e.target.value})}/></Field>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Vehicle tiles</Label>
                      <div className="text-xs text-slate-500">Add up to 9 (renders 3 per row)</div>
                    </div>
                    <div className="space-y-3">
                      {vehicles.map((v, i) => (
                        <VehicleRow
                          key={i}
                          idx={i}
                          item={v}
                          onChange={(nv) => {
                            const copy = vehicles.slice();
                            copy[i] = nv;
                            setVehicles(copy);
                          }}
                          onRemove={() => {
                            const copy = vehicles.slice();
                            copy.splice(i, 1);
                            setVehicles(copy);
                          }}
                        />
                      ))}
                      <Button
                        onClick={() => setVehicles([...vehicles, { img: "", href: "" }])}
                        className="w-full"
                      >Add vehicle</Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="EV Headline image URL">
                      <Input value={ev.headlineImg} onChange={(e)=>setEv({...ev, headlineImg:e.target.value})}/>
                    </Field>
                    <Field label="EV Banner image URL">
                      <Input value={ev.bannerImg} onChange={(e)=>setEv({...ev, bannerImg:e.target.value})}/>
                    </Field>
                    <Field label="EV Banner link URL">
                      <Input value={ev.bannerHref} onChange={(e)=>setEv({...ev, bannerHref:e.target.value})}/>
                    </Field>
                  </div>
                </CardContent></Card>
              </TabsContent>

              <TabsContent when="branding">
                <Card className="mt-3"><CardContent className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Logo URL"><Input value={branding.logoUrl} onChange={(e)=>setBranding({...branding, logoUrl:e.target.value})}/></Field>
                    <Field label="Logo width (px)"><Input type="number" value={branding.logoWidth} onChange={(e)=>setBranding({...branding, logoWidth:parseInt(e.target.value||'0',10)})}/></Field>
                    <Field label="Brand page background"><Input value={branding.brandBg} onChange={(e)=>setBranding({...branding, brandBg:e.target.value})}/></Field>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Header background"><Input value={branding.headerBg} onChange={(e)=>setBranding({...branding, headerBg:e.target.value})}/></Field>
                    <Field label="Link color"><Input value={branding.linkColor} onChange={(e)=>setBranding({...branding, linkColor:e.target.value})}/></Field>
                    <Field label="Button BG"><Input value={branding.btnBg} onChange={(e)=>setBranding({...branding, btnBg:e.target.value})}/></Field>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Button text color"><Input value={branding.btnTextColor} onChange={(e)=>setBranding({...branding, btnTextColor:e.target.value})}/></Field>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Privacy URL"><Input value={footer.privacy} onChange={(e)=>setFooter({...footer, privacy:e.target.value})}/></Field>
                    <Field label="Unsubscribe URL"><Input value={footer.unsubscribe} onChange={(e)=>setFooter({...footer, unsubscribe:e.target.value})}/></Field>
                  </div>
                  <Field label="Legal block">
                    <Textarea rows={3} value={footer.legalBlock} onChange={(e)=>setFooter({...footer, legalBlock:e.target.value})}/>
                  </Field>
                </CardContent></Card>
              </TabsContent>

              <TabsContent when="modules">
                <Card className="mt-3"><CardContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show product grid</Label>
                      <div className="text-xs text-slate-500">3‑wide tiles built from your list</div>
                    </div>
                    <Switch checked={showProductGrid} onCheckedChange={setShowProductGrid} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1"><Label>Show EV section</Label></div>
                    <Switch checked={showEV} onCheckedChange={setShowEV} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1"><Label>Show shopping tools</Label></div>
                    <Switch checked={showShoppingTools} onCheckedChange={setShowShoppingTools} />
                  </div>
                </CardContent></Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: 75% preview */}
          <div className="col-span-12 lg:col-span-9">

          <Card className="mt-3"><CardContent className="space-y-4 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-2xl bg-slate-100 p-1 gap-1">
                <button onClick={()=>setPreviewMode("desktop")} className={`px-3 py-1.5 text-sm rounded-xl ${previewMode==='desktop'?'bg-white shadow':'text-slate-600'}`}>Desktop 600px</button>
                <button onClick={()=>setPreviewMode("mobile")} className={`px-3 py-1.5 text-sm rounded-xl ${previewMode==='mobile'?'bg-white shadow':'text-slate-600'}`}>Mobile ~390px</button>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button onClick={() => navigator.clipboard.writeText(emailHTML)}>Copy HTML</Button>
                <Button variant="secondary" onClick={() => dl("hyundai-email.html", emailHTML)}>Download .html</Button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border shadow bg-white mx-auto" style={{width: previewMode==='mobile' ? 390 : 620}}>
              <div className="bg-slate-50 text-xs text-slate-600 px-3 py-1 border-b">Preview width: {previewMode==='mobile' ? '390px' : '620px (container 600px + padding)'}</div>
              <iframe title="preview" className="w-full h-[800px]" srcDoc={emailHTML} />
            </div>

            <details>
              <summary className="cursor-pointer text-sm text-slate-600">Show raw HTML</summary>
              <Textarea className="mt-2 font-mono" rows={14} value={emailHTML} readOnly />
            </details>
          </CardContent></Card>

          </div>
        </div>
      ) : (
        <div>
          <Tabs defaultValue="content" className="w-full">
            <TabsList>
              <TabsTrigger tab="content">Content</TabsTrigger>
              <TabsTrigger tab="branding">Brand & Layout</TabsTrigger>
              <TabsTrigger tab="modules">Modules</TabsTrigger>
              <TabsTrigger tab="preview">Preview / Export</TabsTrigger>
            </TabsList>

            <TabsContent when="content">
              
            </TabsContent>

            <TabsContent when="branding">
              
            </TabsContent>

            <TabsContent when="modules">
              
            </TabsContent>

            <TabsContent when="preview">

          <Card className="mt-3"><CardContent className="space-y-4 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-2xl bg-slate-100 p-1 gap-1">
                <button onClick={()=>setPreviewMode("desktop")} className={`px-3 py-1.5 text-sm rounded-xl ${previewMode==='desktop'?'bg-white shadow':'text-slate-600'}`}>Desktop 600px</button>
                <button onClick={()=>setPreviewMode("mobile")} className={`px-3 py-1.5 text-sm rounded-xl ${previewMode==='mobile'?'bg-white shadow':'text-slate-600'}`}>Mobile ~390px</button>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button onClick={() => navigator.clipboard.writeText(emailHTML)}>Copy HTML</Button>
                <Button variant="secondary" onClick={() => dl("hyundai-email.html", emailHTML)}>Download .html</Button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border shadow bg-white mx-auto" style={{width: previewMode==='mobile' ? 390 : 620}}>
              <div className="bg-slate-50 text-xs text-slate-600 px-3 py-1 border-b">Preview width: {previewMode==='mobile' ? '390px' : '620px (container 600px + padding)'}</div>
              <iframe title="preview" className="w-full h-[800px]" srcDoc={emailHTML} />
            </div>

            <details>
              <summary className="cursor-pointer text-sm text-slate-600">Show raw HTML</summary>
              <Textarea className="mt-2 font-mono" rows={14} value={emailHTML} readOnly />
            </details>
          </CardContent></Card>

            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default function EmailBuilder() {
  const [meta, setMeta] = useState({
    title: "Hyundai",
    preheader: "##preview-text##",
    subjectLine: "Hyundai news & updates",
  });

  const [branding, setBranding] = useState({
    logoUrl:
      "https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//logo-head-hyundai@2x.png",
    logoWidth: 150,
    brandBg: "#f6f6f7",
    headerBg: "#F6F3F2",
    linkColor: "#002C5F",
    btnBg: "#002c5f",
    btnTextColor: "#ffffff",
  });

  const [hero, setHero] = useState({
    href: "https://www.hyundaiusa.com/us/en",
    img: "https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//img-hero@2x.jpg",
    alt: "Young couple standing beside IONIQ 6",
  });

  const [intro, setIntro] = useState({
    copy:
      "Thanks for signing up for Hyundai news. Explore all we offer on our website and Instagram.",
    websiteHref: "https://www.hyundaiusa.com/us/en",
    instagramHref: "https://instagram.com/hyundaiusa",
    closing: "It’s your journey.",
  });

  const [vehicles, setVehicles] = useState([{ img: "", href: "" }]);

  const [ev, setEv] = useState({
    headlineImg:
      "https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//Headline.png",
    bannerImg:
      "https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//img-electrified-banner@2x.jpg",
    bannerHref: "https://www.hyundaiusa.com/us/en/vehicles/ioniq-6",
  });

  const [shop, setShop] = useState({
    requestQuote: "https://www.hyundaiusa.com/us/en/request-quote",
    build: "https://www.hyundaiusa.com/us/en/build",
    offers: "https://www.hyundaiusa.com/us/en/offers",
    inventory: "https://www.hyundaiusa.com/us/en/inventory-search",
  });

  const [footer, setFooter] = useState({
    privacy: "https://www.hyundaiusa.com/us/en/privacy-policy",
    unsubscribe: "#",
    contact: "https://owners.hyundaiusa.com/us/en/contact-us.html",
    social: {
      facebook: "https://www.facebook.com/Hyundai",
      tiktok: "https://www.tiktok.com/@hyundaiusa",
      instagram: "https://www.instagram.com/hyundaiusa",
      twitter: "https://www.twitter.com/hyundai",
      youtube: "https://www.youtube.com/hyundai",
    },
    legalBlock:
      "Vehicles shown with options. Hyundai® is a registered trademark. © " +
      new Date().getFullYear() +
      " Hyundai Motor America.",
  });

  const [showProductGrid, setShowProductGrid] = useState(true);
  const [showEV, setShowEV] = useState(true);
  const [showShoppingTools, setShowShoppingTools] = useState(true);
  const [previewMode, setPreviewMode] = useState("desktop"); // desktop or mobile
  const [splitView, setSplitView] = useState(true); // show 25% options / 75% preview
  const [splitWidth, setSplitWidth] = useState(30); // left pane width in %
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);
  const startDrag = (e) => { setDragging(true); e.preventDefault(); };
  useEffect(() => {
    function onMove(e){
      if(!dragging) return;
      const el = containerRef.current;
      if(!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let pct = (x / rect.width) * 100;
      pct = Math.max(20, Math.min(60, pct));
      setSplitWidth(pct);
    }
    function onUp(){ setDragging(false); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const emailHTML = useMemo(() => {
    const groups = [];
    for (let i = 0; i < vehicles.length; i += 3) groups.push(vehicles.slice(i, i + 3));

    const vehicleRows = groups
      .map(
        (row) => `
<tr>
  ${row
    .map(
      (v) => `
  <td align="center" style="background-color:#F6F3F2;padding:0 0 10px 0;">
    ${
      v.img
        ? `<a href="${v.href}" target="_blank"><img src="${v.img}" width="200" style="display:block;width:200px;max-width:100%;height:auto;border:0;" alt="Vehicle"/></a>`
        : ""
    }
  </td>`
    )
    .join("")}
</tr>`
      )
      .join("\n");

    const shopMenu = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:580px;background:#ffffff;">
  <tr>
    <td style="text-align:center;font-size:0;">
      <div style="display:inline-block;vertical-align:top;max-width:290px;width:100%;">
        <table width="100%" role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:10px 0;">
              <a href="${shop.requestQuote}" target="_blank" style="display:block;color:#000;text-decoration:none;">
                <img src="https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//icon-menu-online-blkBlue@2x.png" width="44" height="44" style="display:block;margin:0 auto;border:0;" alt="Request a Quote"/>
                <div style="font-size:11px;line-height:11px;margin-top:6px;">Request a Quote</div>
              </a>
            </td>
            <td align="center" style="padding:10px 0;">
              <a href="${shop.build}" target="_blank" style="display:block;color:#000;text-decoration:none;">
                <img src="https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//icon-menu-build-blkBlue@2x.png" width="44" height="44" style="display:block;margin:0 auto;border:0;" alt="Build and Price"/>
                <div style="font-size:11px;line-height:11px;margin-top:6px;">Build and Price</div>
              </a>
            </td>
          </tr>
        </table>
      </div>
      <div style="display:inline-block;vertical-align:top;max-width:290px;width:100%;">
        <table width="100%" role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:10px 0;">
              <a href="${shop.offers}" target="_blank" style="display:block;color:#000;text-decoration:none;">
                <img src="https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//icon-menu-offers-blkBlue@2x.png" width="44" height="44" style="display:block;margin:0 auto;border:0;" alt="Local Offers"/>
                <div style="font-size:11px;line-height:11px;margin-top:6px;">Local Offers</div>
              </a>
            </td>
            <td align="center" style="padding:10px 0;">
              <a href="${shop.inventory}" target="_blank" style="display:block;color:#000;text-decoration:none;">
                <img src="https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//icon-menu-inventory-blkBlue@2x.png" width="44" height="44" style="display:block;margin:0 auto;border:0;" alt="Inventory Search"/>
                <div style="font-size:11px;line-height:11px;margin-top:6px;">Inventory Search</div>
              </a>
            </td>
          </tr>
        </table>
      </div>
    </td>
  </tr>
</table>`;

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${meta.title}</title>
  <style>body,html{margin:0!important;padding:0!important;background:${branding.brandBg}!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}img{display:block;border:0;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic}table{border-spacing:0;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}a{color:${branding.linkColor};text-decoration:none} .container{width:100%;max-width:600px;margin:0 auto;background:#fff}.rl{padding:0 20px}</style>
  <style>@media only screen and (max-width:630px){.mob-column{display:block!important;width:100%!important}}</style>
</head>
<body style="background:${branding.brandBg};">
  <center style="width:100%;table-layout:fixed;background:${branding.brandBg}">
    <table role="presentation" width="100%" id="body-table" style="background:${branding.brandBg}"><tr><td>
      <table role="presentation" className="container" align="center">
        <tr><td>
          <table width="100%" role="presentation" style="background:${branding.headerBg}"><tr><td className="rl" style="padding:20px;">
            <table width="100%" role="presentation" style="max-width:540px;margin:0 auto;">
              <tr>
                <td valign="middle" align="left">
                  <img src="${branding.logoUrl}" width="${branding.logoWidth}" style="width:${branding.logoWidth}px;max-width:100%;height:auto" alt="Hyundai"/>
                </td>
                <td valign="middle" align="right" style="font:12px/12px Arial,Helvetica,sans-serif;color:#0d0d0d">&nbsp;</td>
              </tr>
            </table>
          </td></tr></table>

          <table role="presentation" width="100%"><tr><td>
            <a href="${hero.href}" target="_blank"><img src="${hero.img}" width="600" style="width:100%;max-width:600px;height:auto" alt="${hero.alt}"/></a>
          </td></tr></table>

          <table role="presentation" width="100%"><tr><td class="rl" style="padding:25px 20px 30px;">
            <table role="presentation" width="100%" style="max-width:540px;margin:0 auto;font:16px/24px Arial,Helvetica,sans-serif;color:#0d0d0d">
              <tr><td>
                <p style="margin:0 0 16px 0">${intro.copy.replace(
                  /website/gi,
                  `<a href='${intro.websiteHref}' target='_blank' style='text-decoration:underline;color:${branding.linkColor}'>website</a>`
                ).replace(
                  /Instagram/gi,
                  `<a href='${intro.instagramHref}' target='_blank' style='text-decoration:underline;color:${branding.linkColor}'>Instagram</a>`
                )}</p>
                <p style="margin:20px 0 0 0;font:600 20px/26px Arial,Helvetica,sans-serif">${intro.closing}</p>
              </td></tr>
            </table>
          </td></tr></table>

          ${showProductGrid && vehicles.filter(v=>v.img).length ? `
          <table role="presentation" width="100%" style="background:#F6F3F2"><tr><td class="rl" style="padding:40px 20px 20px;">
            <table width="100%" role="presentation" style="max-width:540px;margin:0 auto;text-align:center">
              <tr><td style="font:600 30px/30px Arial,Helvetica,sans-serif;color:#000">A Hyundai for every journey.</td></tr>
              <tr><td style="font:400 20px/24px Arial,Helvetica,sans-serif;color:#000;padding-top:8px">Click to explore each vehicle.</td></tr>
            </table>
            <table role="presentation" width="100%" style="max-width:600px;margin:15px auto 0;">
              ${vehicleRows}
            </table>
          </td></tr></table>` : ""}

          ${showEV ? `
          <table role="presentation" width="100%"><tr><td>
            <a href="https://www.hyundaiusa.com/us/en/electrified" target="_blank"><img src="${ev.headlineImg}" width="600" style="width:100%;max-width:600px;height:auto" alt="EV Headline"/></a>
          </td></tr></table>
          <table role="presentation" width="100%"><tr><td>
            <a href="${ev.bannerHref}" target="_blank"><img src="${ev.bannerImg}" width="600" style="width:100%;max-width:600px;height:auto" alt="Electrified banner"/></a>
          </td></tr></table>` : ""}

          ${showShoppingTools ? `
          <table role="presentation" width="100%"><tr><td style="padding-top:20px">${shopMenu}</td></tr></table>` : ""}

          <table role="presentation" width="100%" style="padding-top:15px"><tr><td>
            <table role="presentation" width="90%" align="center"><tr><td style="border-bottom:2px solid ${branding.brandBg}"></td></tr></table>
          </td></tr></table>

          <table role="presentation" width="100%"><tr><td class="rl" style="padding:30px 20px 10px;">
            <table role="presentation" width="100%" style="max-width:540px;margin:0 auto">
              <tr>
                <td width="70%" style="font:12px/12px Arial,Helvetica,sans-serif;color:#0d0d0d;white-space:nowrap;text-align:center">
                  <a href="${footer.privacy}" target="_blank" style="text-decoration:underline;color:#0d0d0d;letter-spacing:.05em">privacy</a>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <a href="${footer.unsubscribe}" target="_blank" style="text-decoration:underline;color:#0d0d0d;letter-spacing:.05em">unsubscribe</a>
                </td>
                <td width="30%" align="center">
                  <table role="presentation"><tr>
                    <td><a href="${footer.social.facebook}" target="_blank"><img width="21" height="21" alt="Facebook" src="https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//icon-social-facebook-blk@2x.png"/></a></td>
                    <td><a href="${footer.tiktok}" target="_blank"><img width="17" height="17" alt="TikTok" src="https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//icon-social-tiktok-blk@2x.png"/></a></td>
                    <td><a href="${footer.social.instagram}" target="_blank"><img width="21" height="21" alt="Instagram" src="https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//icon-social-instagram-blk@2x.png"/></a></td>
                    <td><a href="${footer.social.twitter}" target="_blank"><img width="21" height="21" alt="Twitter" src="https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//icon-social-twitter-blk@2x.png"/></a></td>
                    <td><a href="${footer.social.youtube}" target="_blank"><img width="21" height="21" alt="YouTube" src="https://papp.services.hma.us/SharedServices/hyundai/image/v1/EmailTemplate/HMA_2023_Generic_TTY_HAEA/images//icon-social-youtube-blk@2x.png"/></a></td>
                  </tr></table>
                </td>
              </tr>
            </table>
          </td></tr></table>

          <table role="presentation" width="100%"><tr><td class="rl" style="padding:10px 20px 30px;">
            <table role="presentation" width="100%" style="max-width:540px;margin:0 auto;font:12px/14px Arial,Helvetica,sans-serif;color:#0d0d0d">
              <tr><td>
                <p style="margin:0 0 10px 0"><strong>Please do not reply to this email.</strong> Questions? Visit our <a href="${footer.contact}" target="_blank" style="text-decoration:underline;color:#0d0d0d">Consumer Assistance Center</a>.</p>
                <p style="margin:0 0 10px 0">${footer.legalBlock}</p>
              </td></tr>
            </table>
          </td></tr></table>

        </td></tr>
      </table>
    </td></tr></table>
  </center>
</body>
</html>`;
  }, [branding, meta, hero, intro, vehicles, ev, shop, footer, showProductGrid, showEV, showShoppingTools]);

  
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hyundai‑style Email Builder</h1>
          <p className="text-sm text-slate-600">Brand‑correct, 600px table layout. Export full HTML compatible with Gmail/Outlook.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">Split view</span>
          <button onClick={()=>setSplitView(!splitView)} className={`rounded-2xl px-3 py-1.5 text-sm border ${splitView?'bg-black text-white border-black':'bg-white text-black'}`}>
            {splitView ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {splitView ? (
        <div className="grid grid-cols-12 gap-4">
          {/* Left: 25% options (tabs without preview) */}
          <div className="col-span-12 lg:col-span-3 space-y-3">
            <Tabs defaultValue="content" className="w-full">
              <TabsList>
                <TabsTrigger tab="content">Content</TabsTrigger>
                <TabsTrigger tab="branding">Brand & Layout</TabsTrigger>
                <TabsTrigger tab="modules">Modules</TabsTrigger>
              </TabsList>

              <TabsContent when="content">
                <Card className="mt-3"><CardContent className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Subject line">
                      <Input value={meta.subjectLine} onChange={(e)=>setMeta({...meta, subjectLine:e.target.value})}/>
                    </Field>
                    <Field label="Preheader">
                      <Input value={meta.preheader} onChange={(e)=>setMeta({...meta, preheader:e.target.value})}/>
                    </Field>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Hero link URL">
                      <Input value={hero.href} onChange={(e)=>setHero({...hero, href:e.target.value})}/>
                    </Field>
                    <Field label="Hero image URL">
                      <Input value={hero.img} onChange={(e)=>setHero({...hero, img:e.target.value})}/>
                    </Field>
                    <Field label="Hero alt text">
                      <Input value={hero.alt} onChange={(e)=>setHero({...hero, alt:e.target.value})}/>
                    </Field>
                  </div>

                  <Field label="Intro paragraph (links to ‘website’ and ‘Instagram’ auto‑hyperlinked)">
                    <Textarea rows={3} value={intro.copy} onChange={(e)=>setIntro({...intro, copy:e.target.value})}/>
                  </Field>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Website URL"><Input value={intro.websiteHref} onChange={(e)=>setIntro({...intro, websiteHref:e.target.value})}/></Field>
                    <Field label="Instagram URL"><Input value={intro.instagramHref} onChange={(e)=>setIntro({...intro, instagramHref:e.target.value})}/></Field>
                    <Field label="Closing line"><Input value={intro.closing} onChange={(e)=>setIntro({...intro, closing:e.target.value})}/></Field>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Vehicle tiles</Label>
                      <div className="text-xs text-slate-500">Add up to 9 (renders 3 per row)</div>
                    </div>
                    <div className="space-y-3">
                      {vehicles.map((v, i) => (
                        <VehicleRow
                          key={i}
                          idx={i}
                          item={v}
                          onChange={(nv) => {
                            const copy = vehicles.slice();
                            copy[i] = nv;
                            setVehicles(copy);
                          }}
                          onRemove={() => {
                            const copy = vehicles.slice();
                            copy.splice(i, 1);
                            setVehicles(copy);
                          }}
                        />
                      ))}
                      <Button
                        onClick={() => setVehicles([...vehicles, { img: "", href: "" }])}
                        className="w-full"
                      >Add vehicle</Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="EV Headline image URL">
                      <Input value={ev.headlineImg} onChange={(e)=>setEv({...ev, headlineImg:e.target.value})}/>
                    </Field>
                    <Field label="EV Banner image URL">
                      <Input value={ev.bannerImg} onChange={(e)=>setEv({...ev, bannerImg:e.target.value})}/>
                    </Field>
                    <Field label="EV Banner link URL">
                      <Input value={ev.bannerHref} onChange={(e)=>setEv({...ev, bannerHref:e.target.value})}/>
                    </Field>
                  </div>
                </CardContent></Card>
              </TabsContent>

              <TabsContent when="branding">
                <Card className="mt-3"><CardContent className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Logo URL"><Input value={branding.logoUrl} onChange={(e)=>setBranding({...branding, logoUrl:e.target.value})}/></Field>
                    <Field label="Logo width (px)"><Input type="number" value={branding.logoWidth} onChange={(e)=>setBranding({...branding, logoWidth:parseInt(e.target.value||'0',10)})}/></Field>
                    <Field label="Brand page background"><Input value={branding.brandBg} onChange={(e)=>setBranding({...branding, brandBg:e.target.value})}/></Field>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Header background"><Input value={branding.headerBg} onChange={(e)=>setBranding({...branding, headerBg:e.target.value})}/></Field>
                    <Field label="Link color"><Input value={branding.linkColor} onChange={(e)=>setBranding({...branding, linkColor:e.target.value})}/></Field>
                    <Field label="Button BG"><Input value={branding.btnBg} onChange={(e)=>setBranding({...branding, btnBg:e.target.value})}/></Field>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Field label="Button text color"><Input value={branding.btnTextColor} onChange={(e)=>setBranding({...branding, btnTextColor:e.target.value})}/></Field>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Privacy URL"><Input value={footer.privacy} onChange={(e)=>setFooter({...footer, privacy:e.target.value})}/></Field>
                    <Field label="Unsubscribe URL"><Input value={footer.unsubscribe} onChange={(e)=>setFooter({...footer, unsubscribe:e.target.value})}/></Field>
                  </div>
                  <Field label="Legal block">
                    <Textarea rows={3} value={footer.legalBlock} onChange={(e)=>setFooter({...footer, legalBlock:e.target.value})}/>
                  </Field>
                </CardContent></Card>
              </TabsContent>

              <TabsContent when="modules">
                <Card className="mt-3"><CardContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show product grid</Label>
                      <div className="text-xs text-slate-500">3‑wide tiles built from your list</div>
                    </div>
                    <Switch checked={showProductGrid} onCheckedChange={setShowProductGrid} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1"><Label>Show EV section</Label></div>
                    <Switch checked={showEV} onCheckedChange={setShowEV} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1"><Label>Show shopping tools</Label></div>
                    <Switch checked={showShoppingTools} onCheckedChange={setShowShoppingTools} />
                  </div>
                </CardContent></Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: 75% preview */}
          <div className="col-span-12 lg:col-span-9">

          <Card className="mt-3"><CardContent className="space-y-4 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-2xl bg-slate-100 p-1 gap-1">
                <button onClick={()=>setPreviewMode("desktop")} className={`px-3 py-1.5 text-sm rounded-xl ${previewMode==='desktop'?'bg-white shadow':'text-slate-600'}`}>Desktop 600px</button>
                <button onClick={()=>setPreviewMode("mobile")} className={`px-3 py-1.5 text-sm rounded-xl ${previewMode==='mobile'?'bg-white shadow':'text-slate-600'}`}>Mobile ~390px</button>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button onClick={() => navigator.clipboard.writeText(emailHTML)}>Copy HTML</Button>
                <Button variant="secondary" onClick={() => dl("hyundai-email.html", emailHTML)}>Download .html</Button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border shadow bg-white mx-auto" style={{width: previewMode==='mobile' ? 390 : 620}}>
              <div className="bg-slate-50 text-xs text-slate-600 px-3 py-1 border-b">Preview width: {previewMode==='mobile' ? '390px' : '620px (container 600px + padding)'}</div>
              <iframe title="preview" className="w-full h-[800px]" srcDoc={emailHTML} />
            </div>

            <details>
              <summary className="cursor-pointer text-sm text-slate-600">Show raw HTML</summary>
              <Textarea className="mt-2 font-mono" rows={14} value={emailHTML} readOnly />
            </details>
          </CardContent></Card>

          </div>
        </div>
      ) : (
        <div>
          <Tabs defaultValue="content" className="w-full">
            <TabsList>
              <TabsTrigger tab="content">Content</TabsTrigger>
              <TabsTrigger tab="branding">Brand & Layout</TabsTrigger>
              <TabsTrigger tab="modules">Modules</TabsTrigger>
              <TabsTrigger tab="preview">Preview / Export</TabsTrigger>
            </TabsList>

            <TabsContent when="content">
              
            </TabsContent>

            <TabsContent when="branding">
              
            </TabsContent>

            <TabsContent when="modules">
              
            </TabsContent>

            <TabsContent when="preview">

          <Card className="mt-3"><CardContent className="space-y-4 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-2xl bg-slate-100 p-1 gap-1">
                <button onClick={()=>setPreviewMode("desktop")} className={`px-3 py-1.5 text-sm rounded-xl ${previewMode==='desktop'?'bg-white shadow':'text-slate-600'}`}>Desktop 600px</button>
                <button onClick={()=>setPreviewMode("mobile")} className={`px-3 py-1.5 text-sm rounded-xl ${previewMode==='mobile'?'bg-white shadow':'text-slate-600'}`}>Mobile ~390px</button>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button onClick={() => navigator.clipboard.writeText(emailHTML)}>Copy HTML</Button>
                <Button variant="secondary" onClick={() => dl("hyundai-email.html", emailHTML)}>Download .html</Button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border shadow bg-white mx-auto" style={{width: previewMode==='mobile' ? 390 : 620}}>
              <div className="bg-slate-50 text-xs text-slate-600 px-3 py-1 border-b">Preview width: {previewMode==='mobile' ? '390px' : '620px (container 600px + padding)'}</div>
              <iframe title="preview" className="w-full h-[800px]" srcDoc={emailHTML} />
            </div>

            <details>
              <summary className="cursor-pointer text-sm text-slate-600">Show raw HTML</summary>
              <Textarea className="mt-2 font-mono" rows={14} value={emailHTML} readOnly />
            </details>
          </CardContent></Card>

            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
