<?php

namespace App\Repository;

use App\Entity\Respuesta;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;


/**
 * @extends ServiceEntityRepository<Respuesta>
 */
class RespuestaRepository extends ServiceEntityRepository
{
    private $entityManager;


    public function __construct(ManagerRegistry $registry, EntityManagerInterface $entityManager)
    {
        // Llamamos al constructor de la clase base
        parent::__construct($registry, Respuesta::class);

        // Obtenemos el EntityManager de Doctrine
        $this->entityManager = $entityManager;
    }


    public function countRespuestasPorOpcion($preguntaId): array
    {
        return $this->createQueryBuilder('r')
            ->select('r.opcElegida, COUNT(r.id) as respuestas_count')
            ->where('r.pregunta_id = :preguntaId')
            ->groupBy('r.opcElegida') // Agrupamos por la opción seleccionada
            ->setParameter('preguntaId', $preguntaId)
            ->getQuery()
            ->getResult();
    }

    public function nuevaRespuesta(Respuesta $respuesta ): void
    {
        try {
            // Aquí persistes la entidad
            $this->entityManager->persist($respuesta);
            $this->entityManager->flush();

        } catch (\Exception $e) {
            // Maneja el error, por ejemplo, logueándolo
            throw new \Exception("Error al guardar la respuesta: " . $e->getMessage());
        }
    }
    

    

    

    

    //    /**
    //     * @return Respuesta[] Returns an array of Respuesta objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('r.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Respuesta
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
