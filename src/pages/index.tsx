import { Button, Box, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type GetImages = {
  data: Image[];
  after: string | null;
};

export default function Home(): JSX.Element {
  async function fetchImages({ pageParam = null }): Promise<GetImages> {
    const after = pageParam ? pageParam : '';

    const { data } = await api.get(`/api/images`, {
      params: {
        after,
      },
    });

    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastResponse => lastResponse.after,
  });

  const formattedData = useMemo(() => {
    return data ? data.pages.map(page => page.data).flat() : [];
  }, [data]);

  const handleFetchNextPage = () => {
    if (!hasNextPage) return;

    fetchNextPage();
  };

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />
      {!(formattedData.length > 0) && (
        <Box
          display="flex"
          h="50vh"
          alignItems="center"
          justifyContent="center"
        >
          <Text>
            Nada por aqui... Faça alguns uploads para visualizar as imagens.
          </Text>
        </Box>
      )}
      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            onClick={handleFetchNextPage}
            role="button"
            w={['100%', 'auto']}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
