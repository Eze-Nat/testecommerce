import { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Container, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import PerfumeCard from '../components/PerfumeCard';
import { fetchPerfumes } from '../api/perfumes';

export default function PerfumesPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce para la búsqueda (se activa después de 500ms de inactividad)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query para scroll infinito
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery(
    ['perfumes', debouncedSearch],
    ({ pageParam = 1 }) => fetchPerfumes({
      page: pageParam,
      search: debouncedSearch,
      limit: 12
    }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < 12) return undefined;
        return allPages.length + 1;
      },
    }
  );

  // Manejo del scroll infinito
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >= 
      document.documentElement.offsetHeight
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Manejar agregar al carrito
  const handleAddToCart = (perfume) => {
    if (!user) {
      alert('Debes iniciar sesión para agregar al carrito');
      return;
    }
    addToCart(perfume);
  };

  if (isLoading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  return (
    <Container className="my-5">
      <h1 className="mb-4">Nuestros Perfumes</h1>
      
      {/* Barra de búsqueda */}
      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar perfumes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="lg"
        />
      </Form.Group>

      {/* Listado de perfumes */}
      <Row className="g-4">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.map(perfume => (
              <Col key={perfume.id} xs={12} sm={6} md={4} lg={3}>
                <PerfumeCard 
                  perfume={perfume} 
                  onAddToCart={() => handleAddToCart(perfume)}
                />
              </Col>
            ))}
          </React.Fragment>
        ))}
      </Row>

      {/* Spinner al cargar más */}
      {isFetchingNextPage && (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      )}

      {/* Mensaje cuando no hay más resultados */}
      {!hasNextPage && data?.pages[0]?.length > 0 && (
        <div className="text-center text-muted my-4">
          No hay más perfumes para mostrar
        </div>
      )}
    </Container>
  );
}