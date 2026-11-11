import { useEffect, useRef, useState } from "react";

import useInView from "@hooks/useInView";
import useLandingPage from "@pages/public/landingPage/hook";
import Reveal from "@pages/public/landingPage/subcomponents/reveal";
import ScenePhoto from "@components/scenePhoto";
import SectionHeading from "@pages/public/landingPage/subcomponents/sectionHeading";
import { photoTones } from "@styles/theme";

import {
  Avatar,
  Card,
  Compare,
  CompareLayer,
  CompareTag,
  DownloadButton,
  Extras,
  GuestButton,
  Guests,
  GuestsLabel,
  Handle,
  Inner,
  Night,
  Perspective,
  Polaroid,
  RangeInput,
  Section,
  Thumbs,
  Timeline,
  TimelineHeader,
  ZipFile
} from "./styles";
import type { DownloadState } from "./types";

import type { ChangeEvent, CSSProperties } from "react";

const guestCycle = 4000;
const rotations = ["-3deg", "2deg", "-1.5deg", "3deg"];

const AfterParty = () => {
  const { data } = useLandingPage();
  const after = data.afterParty;
  const perspectiveRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(perspectiveRef, { once: false, threshold: 0.3 });
  const [guestIndex, setGuestIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [split, setSplit] = useState(50);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");

  const guest = after.guests[guestIndex];
  const thumbnails = after.guests.flatMap((item) => item.photos.slice(0, 2));

  useEffect(() => {
    if (isPaused || !isVisible) return;
    const timer = window.setTimeout(() => setGuestIndex((value) => (value + 1) % after.guests.length), guestCycle);
    return () => window.clearTimeout(timer);
  }, [guestIndex, isPaused, isVisible, after.guests.length]);

  useEffect(() => {
    if (downloadState !== "running") return;
    const timer = window.setInterval(() => {
      setDownloadProgress((value) => Math.min(1, value + 0.07));
    }, 60);
    return () => window.clearInterval(timer);
  }, [downloadState]);

  useEffect(() => {
    if (downloadState === "running" && downloadProgress >= 1) setDownloadState("done");
  }, [downloadState, downloadProgress]);

  const handleSelectGuest = (index: number) => {
    setIsPaused(true);
    setGuestIndex(index);
  };

  const handleDownload = () => {
    if (downloadState === "running") return;
    setDownloadProgress(0);
    setDownloadState("running");
  };

  const downloadLabel =
    downloadState === "done"
      ? `${after.download.done} ✓`
      : downloadState === "running"
        ? `compactando originais… ${Math.round(downloadProgress * 100)}%`
        : after.download.button;

  return (
    <Section id="pos-evento">
      <Inner>
        <SectionHeading
          eyebrow={after.eyebrow}
          title={after.title}
          highlight={after.highlight}
          description={after.description}
        />

        <Reveal effect="zoom">
          <Perspective ref={perspectiveRef}>
            <Guests role="group" aria-label="Escolha um convidado">
              <GuestsLabel>a festa vista por</GuestsLabel>
              {after.guests.map((item, index) => (
                <GuestButton
                  key={item.id}
                  type="button"
                  aria-pressed={index === guestIndex}
                  data-paused={isPaused}
                  onClick={() => handleSelectGuest(index)}
                  style={{ "--cycle": `${guestCycle}ms` } as CSSProperties}
                  data-cursor="ver a festa"
                >
                  <Avatar style={{ background: photoTones[item.tone][0] }}>{item.name.charAt(0)}</Avatar>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.role}</small>
                  </span>
                </GuestButton>
              ))}
            </Guests>

            <Timeline aria-live="polite">
              <TimelineHeader>
                <h3>
                  a festa pelo olhar de <span>{guest.name}</span>
                </h3>
                <small>{guest.role}</small>
              </TimelineHeader>
              <Night key={guest.id}>
                {guest.photos.map((photo, index) => (
                  <Polaroid
                    key={photo.id}
                    style={{ "--rot": rotations[index % rotations.length], "--i": index } as CSSProperties}
                  >
                    <div>
                      <ScenePhoto kind={photo.kind} tone={photo.tone} />
                    </div>
                    <figcaption>
                      <span>{photo.caption}</span>
                      <span>{photo.time}</span>
                    </figcaption>
                  </Polaroid>
                ))}
              </Night>
            </Timeline>
          </Perspective>
        </Reveal>

        <Extras>
          <Reveal effect="slideRight">
            <Card>
              <h3>{after.compareTitle}</h3>
              <p>{after.compareText}</p>
              <Compare style={{ "--split": `${split}%` } as CSSProperties} data-cursor="arraste">
                <CompareLayer data-side="before">
                  <ScenePhoto kind="dance" tone="dusk" quality="compressed" />
                </CompareLayer>
                <CompareLayer data-side="after">
                  <ScenePhoto kind="dance" tone="dusk" />
                </CompareLayer>
                <CompareTag data-side="before">{after.compareBefore}</CompareTag>
                <CompareTag data-side="after">{after.compareAfter}</CompareTag>
                <RangeInput
                  type="range"
                  min={0}
                  max={100}
                  value={split}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setSplit(Number(event.target.value))}
                  aria-label="Comparar foto comprimida com a original"
                />
                <Handle />
              </Compare>
            </Card>
          </Reveal>

          <Reveal effect="slideLeft" delay={60}>
            <Card>
              <h3>baixe tudo em alta, num único .zip.</h3>
              <p>Todas as fotos originais, com quem tirou e quando.</p>
              <ZipFile>
                <span>.ZIP</span>
                <div>
                  <strong>{after.download.fileName}</strong>
                  <small>
                    {after.download.count} · {after.download.size}
                  </small>
                </div>
              </ZipFile>
              <Thumbs aria-hidden="true">
                {thumbnails.map((photo, index) => (
                  <div
                    key={photo.id}
                    data-more={index === thumbnails.length - 1 ? `+${after.download.count}` : undefined}
                  >
                    <ScenePhoto kind={photo.kind} tone={photo.tone} />
                  </div>
                ))}
              </Thumbs>
              <DownloadButton
                type="button"
                data-state={downloadState}
                onClick={handleDownload}
                style={{ "--done": downloadProgress } as CSSProperties}
                data-cursor="simular"
              >
                <i aria-hidden="true" />
                <span>{downloadLabel}</span>
              </DownloadButton>
            </Card>
          </Reveal>
        </Extras>
      </Inner>
    </Section>
  );
};

export default AfterParty;
