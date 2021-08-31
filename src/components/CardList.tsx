import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const { onOpen, onClose, isOpen } = useDisclosure();

  function handleViewImage(url: string) {
    setSelectedImageUrl(url);
    onOpen();
  }

  return (
    <>
      <SimpleGrid columns={3} spacing="2.5rem">
        {cards.map(card => (
          <Card
            key={card.id}
            data={card}
            viewImage={url => handleViewImage(url)}
          />
        ))}
      </SimpleGrid>

      {selectedImageUrl && (
        <ModalViewImage
          isOpen={isOpen}
          imgUrl={selectedImageUrl}
          onClose={onClose}
        />
      )}
    </>
  );
}
