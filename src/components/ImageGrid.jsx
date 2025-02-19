import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import '@fontsource/archivo-black';


const imageData = [
  { src: "/biggerscience.png", title: "BIGGER SCIENCE", description: "Immersice experience/WebGL/Gaming" },
  { src: "/muceum.png", title: "MUCEM", description: "Experiental Website" },
  { src: "/unganisha.png", title: "UNGANISHA", description: "Experiental Website/WebGL/3D" },
  { src: "/olive tree.jpg", title: "OLIVE TREE", description: "Interactive installation/Realtime" }
];

const ImageGrid = ({
  hoveredImage,
  setHoveredImage,
  setMousePosition,
}) => {
  const containerRefs = useRef([]);
  const [targetPositions, setTargetPositions] = useState(imageData.map(() => ({ x: 0, y: 0 })));

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      checkImageHover(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [setMousePosition]);

  useEffect(() => {
    const animateImages = () => {
      containerRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.to(ref, {
            x: targetPositions[index].x,
            y: targetPositions[index].y,
            duration: 2,
            ease: "power2.out",
          });
        }
      });
    };

    animateImages();
  }, [targetPositions]);

  const checkImageHover = (x, y) => {
    let newHoveredIndex = null;
    containerRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          newHoveredIndex = index;
        }
      }
    });

    setHoveredImage(newHoveredIndex);
    updateTargetPositions(newHoveredIndex, x, y);
  };

  const updateTargetPositions = (hoveredIndex, cursorX, cursorY) => {
    const newTargetPositions = targetPositions.map((pos, index) => {
      if (index === hoveredIndex) {
        const containerRef = containerRefs.current[index];
        if (containerRef) {
          const rect = containerRef.getBoundingClientRect();
          const centerX = (rect.left + rect.right) / 2;
          const centerY = (rect.top + rect.bottom) / 2;

          // Increase movement range
          const maxMoveX = Math.min(window.innerWidth / 4, 100);
          const maxMoveY = Math.min(window.innerHeight / 4, 100);

          let dx = (cursorX - centerX) * 0.5; // Increase movement speed
          let dy = (cursorY - centerY) * 0.5;

          // Add bouncing effect
          if (Math.abs(dx) > maxMoveX) {
            dx = maxMoveX * Math.sign(dx) * (1 - Math.exp(-Math.abs(dx - maxMoveX) / 50));
          }
          if (Math.abs(dy) > maxMoveY) {
            dy = maxMoveY * Math.sign(dy) * (1 - Math.exp(-Math.abs(dy - maxMoveY) / 50));
          }

          return { x: dx, y: dy };
        }
      }
      return { x: 0, y: 0 };
    });
    setTargetPositions(newTargetPositions);
  };

  const ImageComponent = ({ image, index, hoveredImage, setHoveredImage }) => (
    <div
      className="relative overflow-hidden"
      style={{
        width: "340px",
        height: "200px",
      }}
      onMouseEnter={() => setHoveredImage(index)}
      onMouseLeave={() => setHoveredImage(null)}
    >
      {hoveredImage === null || hoveredImage === index ? (
        <img
          src={image.src}
          alt={`Image ${index + 1}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="relative" style={{ width: "340px", height: "248px" }}>
            {hoveredImage !== null && (
              <>
                {(() => {
                  const width = 340;
                  const height = 200;
                  const angle = Math.atan(height / width) * (180 / Math.PI);
                  return (
                    <>
                      <div
                        className="absolute"
                        style={{
                          width: `${Math.sqrt(width ** 2 + height ** 2)}px`,
                          height: "1px",
                          backgroundColor: "#616161",
                          top: "0",
                          left: "0",
                          transform: `rotate(${angle}deg)`,
                          transformOrigin: "top left",
                          zIndex: "40",
                        }}
                      />
                      <div className="absolute top-0 left-0 right-0 bottom-0 border border-[#616161]" />
                      <div
                        className="absolute"
                        style={{
                          width: `${Math.sqrt(width ** 2 + height ** 2)}px`,
                          height: "1px",
                          backgroundColor: "#616161",
                          top: "0",
                          right: "0",
                          transform: `rotate(-${angle}deg)`,
                          transformOrigin: "top right",
                          zIndex: "40",
                        }}
                      />
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const TextComponent = ({ image, index, hoveredImage }) => (
    <div
      className="absolute text-white"
      style={{
        zIndex: 40,
        width: "340px",
        bottom: "-45px",
        left: "100%",
        opacity: hoveredImage === index ? 1 : 0,
        transition: "opacity 0.3s ease",
        transform: "translateX(-50%)",
        textAlign: "left",
      }}
    >
      <h1 style={{ fontSize: "48px", fontWeight: "bold",  fontFamily: 'Archivo Black, sans-serif',}}>{image.title}</h1>
      <p className="text-sm">{image.description}</p>
    </div>
  );

  return (
    <div>
      <style>
        {`
          .circular-layout {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 600px;
            height: 600px;
          }

          .circular-item {
            position: absolute;
            width: 340px;
            height: 210px;
            transform: translate(-50%, -50%);
          }

          .circular-item:nth-child(1) {
            top: 35%;
            left: -10%;
          }

          .circular-item:nth-child(2) {
            top: 20%;
            left: 106%;
          }

          .circular-item:nth-child(3) {
            top: 90%;
            left: 10%;
          }
          .circular-item:nth-child(4) {
            top: 80%;
            left: 110%;
          }  
        `}
      </style>

      <div className="circular-layout">
        {imageData.map((image, index) => {
          const imageLinks = [
            "https://sourceforge.net/projects/midbar/",
            "https://sourceforge.net/projects/lakhash/",
            "https://sourceforge.net/projects/the-lantern-project/",
          ];

          return (
            <div
              key={index}
              ref={(el) => {
                containerRefs.current[index] = el;
              }}
              className="circular-item"
              style={{
                zIndex: hoveredImage === null ? "10" : "30",
              }}
            >
              <a
                href={imageLinks[index]}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredImage(index)}
              >
                <ImageComponent
                  image={image}
                  index={index}
                  hoveredImage={hoveredImage}
                  setHoveredImage={setHoveredImage}
                />
              </a>
              <TextComponent
                image={image}
                index={index}
                hoveredImage={hoveredImage}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageGrid;
