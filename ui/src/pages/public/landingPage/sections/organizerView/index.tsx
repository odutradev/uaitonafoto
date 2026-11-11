import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckRounded as CheckIcon,
  CloseRounded as CloseIcon,
  GroupsRounded as GroupsIcon,
  ShieldRounded as ShieldIcon,
  TvRounded as TvIcon
} from "@mui/icons-material";

import useInView from "@hooks/useInView";
import useLandingPage from "@pages/public/landingPage/hook";
import Reveal from "@pages/public/landingPage/subcomponents/reveal";
import ScenePhoto from "@pages/public/landingPage/subcomponents/scenePhoto";
import SectionHeading from "@pages/public/landingPage/subcomponents/sectionHeading";

import {
  Bullet,
  Bullets,
  Card,
  CardMeta,
  CardPhoto,
  Copy,
  DecisionButton,
  Decisions,
  EmptySlot,
  Inner,
  OnScreen,
  Panel,
  PanelHeader,
  Queue,
  QueueLabel,
  Section,
  Side,
  Stat,
  Stats,
  TableCell,
  Tables,
  Timer,
  Workspace
} from "./styles";
import type { Decision, DecidedPhoto, OrganizerStats } from "./types";

import type { CSSProperties } from "react";

const autoDecideDelay = 2600;
const exitDuration = 340;
const bulletIcons = [ShieldIcon, GroupsIcon, TvIcon];

const OrganizerView = () => {
  const { data } = useLandingPage();
  const organizer = data.organizerView;
  const panelRef = useRef<HTMLDivElement>(null);
  const isPanelVisible = useInView(panelRef, { once: false, threshold: 0.3 });
  const [cursor, setCursor] = useState(0);
  const [exiting, setExiting] = useState<Decision | null>(null);
  const [decided, setDecided] = useState<DecidedPhoto[]>([]);
  const [stats, setStats] = useState<OrganizerStats>({ photos: 284, guests: 126, likes: 1912 });
  const [tables, setTables] = useState(organizer.tables);

  const current = organizer.queue[cursor % organizer.queue.length];
  const suggestion: Decision = current.shouldReject ? "reject" : "approve";
  const approved = decided.filter((item) => item.decision === "approve").slice(-4);
  const maxHeat = Math.max(...tables.map((table) => table.photos));

  const handleDecision = useCallback(
    (decision: Decision) => {
      if (exiting) return;
      setExiting(decision);
      window.setTimeout(() => {
        setDecided((previous) => [...previous.slice(-11), { photo: current, decision }]);
        setStats((previous) => ({
          photos: previous.photos + 1,
          guests: previous.guests + (cursor % 3 === 0 ? 1 : 0),
          likes: previous.likes + 3 + (cursor % 5)
        }));
        setTables((previous) =>
          previous.map((table) => (table.name === current.table ? { ...table, photos: table.photos + 1 } : table))
        );
        setCursor((value) => value + 1);
        setExiting(null);
      }, exitDuration);
    },
    [current, cursor, exiting]
  );

  useEffect(() => {
    if (!isPanelVisible || exiting) return;
    const timer = window.setTimeout(() => handleDecision(suggestion), autoDecideDelay);
    return () => window.clearTimeout(timer);
  }, [isPanelVisible, exiting, suggestion, handleDecision, cursor]);

  return (
    <Section id="organizador">
      <Inner>
        <Copy>
          <SectionHeading
            eyebrow={organizer.eyebrow}
            title={organizer.title}
            highlight={organizer.highlight}
            description={organizer.description}
            tone="light"
          />
          <Bullets>
            {organizer.bullets.map((bullet, index) => {
              const Icon = bulletIcons[index % bulletIcons.length];
              return (
                <Reveal key={bullet.title} delay={index * 50} effect="slideRight">
                  <Bullet>
                    <span>
                      <Icon fontSize="small" />
                    </span>
                    <div>
                      <strong>{bullet.title}</strong>
                      <p>{bullet.text}</p>
                    </div>
                  </Bullet>
                </Reveal>
              );
            })}
          </Bullets>
        </Copy>

        <Reveal effect="zoom">
          <Panel ref={panelRef} aria-label="Simulação do painel de moderação do organizador">
            <PanelHeader>
              <span>painel · {data.guestJourney.eventName}</span>
              <span>ao vivo</span>
            </PanelHeader>
            <Stats>
              <Stat>
                <strong>{stats.photos}</strong>
                <span>fotos recebidas</span>
              </Stat>
              <Stat>
                <strong>{stats.guests}</strong>
                <span>convidados no mural</span>
              </Stat>
              <Stat>
                <strong>{stats.likes.toLocaleString("pt-BR")}</strong>
                <span>curtidas</span>
              </Stat>
            </Stats>

            <Workspace>
              <Queue>
                <QueueLabel>
                  <span>aguardando aprovação</span>
                  <span>{organizer.queue.length - (cursor % organizer.queue.length)} na fila</span>
                </QueueLabel>
                <Card key={`${current.id}-${cursor}`} data-exit={exiting ?? undefined}>
                  <CardPhoto>
                    {!exiting && isPanelVisible && (
                      <Timer style={{ "--auto": `${autoDecideDelay}ms` } as CSSProperties} />
                    )}
                    <ScenePhoto
                      kind={current.kind}
                      tone={current.tone}
                      quality={current.shouldReject ? "compressed" : "original"}
                    />
                  </CardPhoto>
                  <CardMeta>
                    <div>
                      <strong>{current.author}</strong>
                      <small>{current.table}</small>
                    </div>
                    {current.mission && <em>missão: {current.mission}</em>}
                    {current.shouldReject && <em data-warning="true">{current.caption}</em>}
                  </CardMeta>
                </Card>
                <Decisions>
                  <DecisionButton
                    type="button"
                    data-variant="reject"
                    data-suggested={suggestion === "reject"}
                    onClick={() => handleDecision("reject")}
                    disabled={Boolean(exiting)}
                    aria-label={`Rejeitar foto de ${current.author}`}
                    data-cursor="rejeitar"
                  >
                    <CloseIcon fontSize="small" /> rejeitar
                  </DecisionButton>
                  <DecisionButton
                    type="button"
                    data-variant="approve"
                    data-suggested={suggestion === "approve"}
                    onClick={() => handleDecision("approve")}
                    disabled={Boolean(exiting)}
                    aria-label={`Aprovar foto de ${current.author} para o telão`}
                    data-cursor="aprovar"
                  >
                    <CheckIcon fontSize="small" /> aprovar
                  </DecisionButton>
                </Decisions>
              </Queue>

              <Side>
                <QueueLabel>
                  <span>fotos por mesa</span>
                </QueueLabel>
                <Tables>
                  {tables.map((table) => {
                    const heat = table.photos / maxHeat;
                    return (
                      <TableCell
                        key={table.name}
                        data-hot={heat > 0.55}
                        data-active={table.name === current.table}
                        style={{ "--heat": heat } as CSSProperties}
                      >
                        <span>{table.name}</span>
                        <strong>{table.photos}</strong>
                      </TableCell>
                    );
                  })}
                </Tables>
                <QueueLabel>
                  <span>no telão agora</span>
                </QueueLabel>
                <OnScreen>
                  {approved.map((item, index) => (
                    <div key={`${item.photo.id}-${decided.length}-${index}`}>
                      <ScenePhoto kind={item.photo.kind} tone={item.photo.tone} />
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - approved.length) }, (_, index) => (
                    <EmptySlot key={`empty-${index}`} />
                  ))}
                </OnScreen>
              </Side>
            </Workspace>
          </Panel>
        </Reveal>
      </Inner>
    </Section>
  );
};

export default OrganizerView;
