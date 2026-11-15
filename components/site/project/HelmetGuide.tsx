import Image from 'next/image'

// The Iron Man helmet build guide. Same steps, parts and sketch as the PDF,
// laid out so it can be followed from a laptop next to the printer.

const contents = [
  ['#quick-steps', 'Quick steps'],
  ['#sizing', 'Sizing'],
  ['#printed-parts', 'Printed parts'],
  ['#hardware', 'Hardware and electronics'],
  ['#arduino-code', 'Arduino code'],
  ['#wiring', 'Wiring diagram'],
  ['#dry-assembly', 'Dry assembly'],
  ['#finishing', 'Finishing'],
  ['#credits', 'Credits'],
]

const sketch = `#include "ServoEasing.h"
ServoEasing servoTop;
ServoEasing servoBottom;

const int action_pin = 2; // trigger/proximity input (pullup)
const int ledPin = 6;     // eyes
const int potPin = A0;    // dimmer

int location = 31;
int bottom_closed = 107;
int top_closed = 167;
int bottom_open = 20;
int top_open = 20;
int value;
int maxBrightness;

void setup() {
    pinMode(action_pin, INPUT_PULLUP);
    pinMode(potPin, INPUT);
    servoTop.attach(9);
    servoBottom.attach(10);
    setSpeedForAllServos(190);
    servoTop.setEasingType(EASE_CUBIC_IN_OUT);
    servoBottom.setEasingType(EASE_CUBIC_IN_OUT);
    synchronizeAllServosStartAndWaitForAllServosToStop();
}

void loop() {
    value = analogRead(potPin);
    maxBrightness = map(value, 250, 750, 0, 255);
    int proximity = digitalRead(action_pin);
    if (proximity == LOW) {
        if (location > bottom_open) {
            servoTop.setEaseTo(top_open);
            servoBottom.setEaseTo(bottom_open);
            synchronizeAllServosStartAndWaitForAllServosToStop();
            location = bottom_open;
            delay(10);
            analogWrite(ledPin, 0);
        } else {
            servoTop.setEaseTo(top_closed);
            servoBottom.setEaseTo(bottom_closed);
            synchronizeAllServosStartAndWaitForAllServosToStop();
            location = bottom_closed;
            delay(50);
            analogWrite(ledPin, maxBrightness / 3);
            delay(100);
            analogWrite(ledPin, maxBrightness / 5);
            delay(100);
            analogWrite(ledPin, maxBrightness / 2);
            delay(100);
            analogWrite(ledPin, maxBrightness / 3);
            delay(100);
            analogWrite(ledPin, maxBrightness);
            delay(100);
        }
    }
}`

function Part({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="guide-part" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>{title}</h3>
      {children}
    </section>
  )
}

export default function HelmetGuide() {
  return (
    <section className="wrap project-section" aria-labelledby="guide">
      <div>
        <h2 id="guide" className="display project-h2">
          Build your own
        </h2>
        <aside className="guide-aside">
          <dl className="guide-facts">
            <div>
              <dt>Build time</dt>
              <dd>About 8 hours</dd>
            </div>
            <div>
              <dt>Skill range</dt>
              <dd>Intermediate maker</dd>
            </div>
          </dl>
          <nav aria-label="Guide contents">
            <ul>
              {contents.map(([href, label]) => (
                <li key={href}>
                  <a className="link" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <div className="min-w-0">
        <Part id="quick-steps" title="Quick steps">
          <ol>
            <li>Print the sizing ring and verify ear clearance.</li>
            <li>Batch print panels and fit-critical parts.</li>
            <li>Upload the Arduino sketch to a Nano Every.</li>
            <li>Bench test servos, LEDs and dimmer before install.</li>
            <li>Dry-fit shell + faceplate and dial servo links.</li>
            <li>Sand, prime, paint red/gold, then clear coat.</li>
            <li>Glue seams, add hardware, padding and straps.</li>
            <li>Suit up and enjoy the arc-reactor vibes.</li>
          </ol>
        </Part>

        <Part id="sizing" title="Sizing the helmet">
          <ol>
            <li>Print the sizing ring included with the model.</li>
            <li>Test fit. Light resistance over the ears is perfect.</li>
            <li>Scale the shell up or down evenly and reprint if needed.</li>
            <li>
              Do not scale the precision parts: brain_base, brain_cap, dimmer_arm, dimmer_mount, ServoArm_active,
              ServoArm_passive.
            </li>
            <li>Need battery clearance? Use the Dome_04-Resize insert.</li>
          </ol>
        </Part>

        <Part id="printed-parts" title="Printed parts list">
          <div className="grid gap-x-8 sm:grid-cols-2">
            <ul>
              <li>Bolt x8</li>
              <li>Brain_base, Brain_cap</li>
              <li>CheekL, CheekR, Chin</li>
              <li>Dimmer, Dimmer_arm, Dimmer_mount</li>
              <li>Dome_01, Dome_01-trenchL, Dome_01-trenchR</li>
            </ul>
            <ul>
              <li>Dome_02, Dome_03, Dome_04</li>
              <li>EarL, EarR, Eyes, Face, Jaw, Mouth</li>
              <li>ServoArm_active, ServoArm_passive</li>
              <li>ServoMount_face, ServoMount_head, Visor</li>
            </ul>
          </div>
          <p className="guide-note">Keep the precision servo parts at 100% scale even if the shell is resized.</p>
        </Part>

        <Part id="hardware" title="Hardware and electronics">
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div>
              <h4>Electronics</h4>
              <ul>
                <li>Arduino Nano Every</li>
                <li>ES08MA micro servos x2</li>
                <li>LED eyes (strip or custom PCB)</li>
                <li>10k potentiometer for brightness</li>
                <li>3-pin slide switch and momentary push button</li>
                <li>AAA battery pack (4-cell)</li>
                <li>Jumper wire kit, 2x 2x6x2.5 mm bearings (optional)</li>
              </ul>
            </div>
            <div>
              <h4>Assembly</h4>
              <ul>
                <li>CA glue or Weld-On 16 for seams</li>
                <li>Elastic head strap and padding kit</li>
                <li>Sandpaper (120 to 400 grit) and filler primer</li>
                <li>Metallic red and gold spray paint, plus clear coat</li>
                <li>Clamps or painter&apos;s tape</li>
                <li>M2 and M2.5 hardware assortment, self-tapping screws</li>
              </ul>
            </div>
          </div>
        </Part>

        <Part id="arduino-code" title="Arduino code">
          <p>
            Upload this sketch with the ServoEasing library installed. Tune the open and closed constants to your servo
            geometry.
          </p>
          <pre className="guide-code" tabIndex={0} aria-label="Arduino sketch">
            <code>{sketch}</code>
          </pre>
          <p>
            In the Arduino IDE, pick &quot;Arduino Nano Every&quot; as the board, install ServoEasing, and tweak the servo
            endpoints until the faceplate seals cleanly.
          </p>
        </Part>

        <Part id="wiring" title="Wiring diagram and notes">
          <a href="/images/wiring-diagram.png" target="_blank" rel="noopener noreferrer" className="guide-diagram">
            <Image
              src="/images/wiring-diagram.png"
              alt="Wiring diagram for the servos, LEDs, potentiometer and switch"
              fill
              className="object-contain"
              sizes="(min-width: 900px) 60vw, 100vw"
            />
          </a>
          <p className="text-sm text-mist">Click the diagram to open it full size in a new tab.</p>
          <ul>
            <li>Servos: signals on D9 and D10, power from the battery or a regulated 5V, ground shared with the Arduino.</li>
            <li>LED driver: PWM on D6 (use a MOSFET if your LEDs pull real current).</li>
            <li>Potentiometer: wiper to A0, outer legs to 5V and GND.</li>
            <li>Faceplate trigger: a normally open momentary switch from D2 to ground, with INPUT_PULLUP.</li>
          </ul>
        </Part>

        <Part id="dry-assembly" title="Dry assembly and alignment">
          <ol>
            <li>Mount the servos to their brackets and check the travel range on the bench.</li>
            <li>Dry-fit the face and dome with painter&apos;s tape, then cycle the servos to confirm clearance.</li>
            <li>If you scaled the shell, mark and re-drill the servo pivot holes to match.</li>
            <li>Use self-tapping screws for temporary alignment, then commit with CA or Weld-On.</li>
          </ol>
        </Part>

        <Part id="finishing" title="Finishing">
          <ol>
            <li>Sand the prints (120, then 220, then 400 grit) and apply filler primer between passes.</li>
            <li>Lay down metallic red on the shell and gold on the faceplate, then finish with clear coat.</li>
            <li>Install the padding and straps, and tuck the wiring away for a safe wearable fit.</li>
          </ol>
          <p>
            For painting, these{' '}
            <a className="link" href="https://youtu.be/xsrnA712-SU" target="_blank" rel="noopener noreferrer">
              smoothing and painting tips
            </a>{' '}
            helped me the most.
          </p>
        </Part>

        <Part id="credits" title="Credits and references">
          <p>
            This build pulls together guidance from{' '}
            <a className="link" href="https://www.youtube.com/@BoxandLoop" target="_blank" rel="noopener noreferrer">
              Box and Loop
            </a>
            , the{' '}
            <a
              className="link"
              href="https://cults3d.com/en/3d-model/various/iron-man-helmet-articulated-wearable"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cults3D release
            </a>
            , the{' '}
            <a className="link" href="https://www.thingiverse.com/thing:4629346" target="_blank" rel="noopener noreferrer">
              Thingiverse remix
            </a>{' '}
            and the original{' '}
            <a
              className="link"
              href="https://www.reddit.com/r/3Dprinting/comments/jev5ax/iron_man_helmet_articulated_wearable_with_stls/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reddit thread
            </a>
            . Huge thanks to everyone who shared designs and troubleshooting tips.
          </p>
        </Part>
      </div>
    </section>
  )
}
