<?php



namespace App\Controller\Api;

use App\Entity\Pregunta;
use App\Repository\RespuestaRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class ResultadoController extends AbstractController
{
    private $respuestaRepository;

    public function __construct(RespuestaRepository $respuestaRepository)
    {
        $this->respuestaRepository = $respuestaRepository;
    }

    
    #[Route('/api/resultados/{preguntaId}', name: 'api_resultados', methods: ['GET'])]
    public function obtenerResultados(int $preguntaId)
    {
        // Obtener las respuestas de la pregunta especificada
        $respuestas = $this->respuestaRepository->findBy(['pregunta_id' => $preguntaId]);

        
        $resultados = [
            'a' => 0,
            'b' => 0,
            'c' => 0,
            'd' => 0
        ];

        foreach ($respuestas as $respuesta) {
            $opcion = $respuesta->getOpcElegida();
            if (isset($resultados[$opcion])) {
                $resultados[$opcion]++;
            }
        }

        return new JsonResponse($resultados);
    }
}
