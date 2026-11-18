// Plano de musculação para bailarina clássica, 4 dias por semana (superior e inferior).
// Usa os mesmos aparelhos do plano iniciante dos pais, para treinarem juntos na academia.
// Nenhuma informação de saúde pessoal fica neste arquivo: só exercícios e cuidados gerais.
const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const PROGRAM_WEEKS = 8;
const WEEKDAY_PLAN = { 0: null, 1: 'SA', 2: 'IA', 3: null, 4: 'SB', 5: null, 6: 'IB' };

PROFILE.avisos = [
  'A musculação complementa o balé: qualidade do movimento vale mais que carga. Pare sempre com 1 a 2 repetições sobrando.',
  'Aqueça antes (bicicleta leve) e não treine pesado em dia de espetáculo ou de ensaio muito intenso. Avise a professora do seu plano.',
  'Desça sempre com controle (3 segundos). Joelhos alinhados com a direção dos pés, sem deixar entrar.',
  'Sem hiperestender joelhos ou cotovelos no topo dos movimentos.',
  'Dor muscular no dia seguinte é normal. Dor na articulação, no tendão (calcanhar, tornozelo) ou dor aguda: pare e procure o seu fisioterapeuta.',
  'Para ganhar massa é preciso comer o suficiente (principalmente proteína em todas as refeições) e dormir bem. Treinar e dançar muito gasta muita energia: se emagrecer sem querer, ficar muito cansada ou notar mudança no ciclo menstrual, procure o médico ou a nutricionista.',
  'Vá quantos dias conseguir, de preferência um dia sim e outro não. Se a semana de aulas estiver pesada, treine menos vezes: o app continua de onde você parou.'
];

const aquec = { n: 'Aquecimento: bicicleta leve', unit: 'min', sets: 1, reps: '5-8', rest: 0, img: 'Bicycling_Stationary', yt: 'aquecimento bicicleta ergométrica',
  cues: ['Ritmo leve, de conversa.', 'Banco alto: o joelho fica quase esticado lá embaixo.', 'Termine com a respiração calma.'] };

const prancha = { n: 'Prancha', unit: 'seg', sets: 3, reps: '20-40', rest: 45, img: 'Plank', yt: 'prancha abdominal execução correta',
  cues: ['Cotovelos sob os ombros, corpo em linha reta.', 'Contraia abdômen e glúteos, sem deixar o quadril cair.', 'Respire normalmente.'] };

const PLAN = {
  SA: { name: 'Superior A', tag: 'Costas, peito e postura', ex: [
    aquec,
    { n: 'Supino na máquina, pegada neutra', sets: 3, reps: '8-12', rest: 90, img: 'Machine_Bench_Press', yt: 'supino máquina peitoral como fazer',
      cues: ['Costas no encosto, ombros para baixo e para trás.', 'Empurre sem estender totalmente os cotovelos.', 'Solte o ar ao empurrar.'] },
    { n: 'Remada sentada na polia', sets: 3, reps: '8-12', rest: 90, img: 'Seated_Cable_Rows', yt: 'remada baixa na polia execução correta',
      cues: ['Peito aberto, coluna longa (postura de bailarina).', 'Puxe até o cotovelo passar do tronco, aproximando as escápulas.', 'Volte devagar, sem soltar os ombros.'] },
    { n: 'Puxada na frente, pegada neutra', sets: 3, reps: '8-12', rest: 90, img: 'Close-Grip_Front_Lat_Pulldown', yt: 'puxada na frente pegada neutra triângulo',
      cues: ['Puxe até a altura do queixo. Nunca atrás da nuca.', 'Ombros longe das orelhas, cotovelos para baixo.', 'Suba devagar, sem deixar o ombro subir.'] },
    { n: 'Desenvolvimento com halteres, sentado', sets: 3, reps: '8-12', rest: 90, img: 'Dumbbell_Shoulder_Press', yt: 'desenvolvimento com halteres sentado execução correta',
      cues: ['Encosto firme, abdômen contraído, ombros longe das orelhas.', 'Halteres na altura das orelhas; suba sem arquear a lombar.', 'Desça com controle, sem bater os halteres no topo.'] },
    { n: 'Rotação externa do ombro (polia ou elástico)', sets: 2, reps: '12-15', rest: 60, img: 'External_Rotation_with_Cable', yt: 'rotação externa ombro elástico exercício',
      cues: ['Cotovelo colado no corpo, dobrado a 90°.', 'Carga leve: estabiliza o ombro para os port de bras.', 'Gire para fora devagar e volte devagar.'] },
    { n: 'Rosca de bíceps com halteres, sentado', sets: 2, reps: '10-12', rest: 60, img: 'Seated_Dumbbell_Curl', yt: 'rosca direta com halteres sentado execução correta',
      cues: ['Cotovelos colados ao corpo, sem balançar o tronco.', 'Suba devagar e desça em 3 segundos.', 'Sem estender totalmente o cotovelo embaixo.'] },
    { n: 'Tríceps na polia com corda', sets: 2, reps: '10-15', rest: 60, img: 'Triceps_Pushdown_-_Rope_Attachment', yt: 'tríceps na polia com corda execução correta',
      cues: ['Cotovelos colados ao corpo e parados.', 'Estique os braços sem travar o cotovelo.', 'Volte devagar.'] },
    prancha
  ]},
  IA: { name: 'Inferior A', tag: 'Força de perna e glúteo', ex: [
    aquec,
    { n: 'Leg press', sets: 4, reps: '8-12', rest: 120, img: 'Leg_Press', yt: 'leg press como fazer iniciante',
      cues: ['Costas e quadril colados no encosto.', 'Pés na largura do quadril; joelhos na direção dos pés.', 'Desça em 3 segundos e empurre sem travar o joelho.'] },
    { n: 'Elevação do quadril com carga (hip thrust)', sets: 4, reps: '8-12', rest: 90, img: 'Barbell_Hip_Thrust', yt: 'hip thrust elevação pélvica execução correta',
      cues: ['Ombros apoiados no banco, pés firmes no chão.', 'Suba o quadril até alinhar com joelhos e ombros.', 'Aperte o glúteo no topo, sem arquear a lombar.'] },
    { n: 'Mesa flexora (parte de trás da coxa)', sets: 3, reps: '10-12', rest: 90, img: 'Lying_Leg_Curls', yt: 'mesa flexora execução correta',
      cues: ['Quadril colado no banco.', 'Suba com força e desça em 3 segundos.', 'Não deixe os pés girarem para fora.'] },
    { n: 'Cadeira extensora', sets: 3, reps: '10-15', rest: 75, img: 'Leg_Extensions', yt: 'cadeira extensora execução correta',
      cues: ['Eixo da máquina alinhado ao joelho.', 'Estenda com controle e segure 1 segundo no topo, sem travar o joelho.', 'Desça em 3 segundos.'] },
    { n: 'Cadeira abdutora', sets: 3, reps: '12-15', rest: 60, img: 'Thigh_Abductor', yt: 'cadeira abdutora execução correta',
      cues: ['Costas no encosto.', 'Abra as pernas devagar, sem impulso.', 'Estabiliza o quadril para o equilíbrio e os giros.'] },
    { n: 'Panturrilha em pé', sets: 4, reps: '10-15', rest: 60, img: 'Standing_Calf_Raises', yt: 'panturrilha em pé execução correta',
      cues: ['Pés paralelos, subida completa na meia-ponta.', 'Desça em 3 segundos, alongando bem o calcanhar.', 'Sem quicar. Controle total.'] },
    { n: 'Panturrilha sentado', sets: 3, reps: '12-15', rest: 60, img: 'Seated_Calf_Raise', yt: 'panturrilha sentado execução correta',
      cues: ['Joelho dobrado trabalha o músculo mais profundo da panturrilha.', 'Suba e segure 1 segundo.', 'Desça devagar.'] }
  ]},
  SB: { name: 'Superior B', tag: 'Ombros, costas e core', ex: [
    aquec,
    { n: 'Flexão com as mãos no banco', sets: 3, reps: '8-12', rest: 90, img: 'Incline_Push-Up', yt: 'flexão inclinada com as mãos no banco',
      cues: ['Mãos no banco, na largura dos ombros.', 'Corpo em linha reta, abdômen firme.', 'Desça até o peito perto do banco e empurre de volta.'] },
    { n: 'Remada na máquina com apoio no peito', sets: 3, reps: '8-12', rest: 90, img: 'Leverage_Iso_Row', yt: 'remada máquina apoio no peito execução',
      cues: ['Peito apoiado, ombros para baixo.', 'Puxe levando os cotovelos para trás.', 'Volte devagar.'] },
    { n: 'Remada unilateral com halter', sets: 3, reps: '8-10', rest: 90, img: 'One-Arm_Dumbbell_Row', yt: 'remada unilateral com halter execução correta',
      cues: ['Uma mão e um joelho apoiados no banco, coluna reta.', 'Puxe o halter em direção ao quadril.', 'Não gire o tronco.'] },
    { n: 'Face pull (polia ou elástico)', sets: 2, reps: '12-15', rest: 60, img: 'Face_Pull', yt: 'face pull polia como fazer',
      cues: ['Carga leve.', 'Puxe a corda em direção ao rosto, abrindo os cotovelos.', 'Ombros longe das orelhas.'] },
    { n: 'Crucifixo inverso na máquina', sets: 3, reps: '12-15', rest: 60, img: 'Reverse_Machine_Flyes', yt: 'crucifixo inverso máquina execução correta',
      cues: ['Peito apoiado no encosto.', 'Abra os braços para trás com os cotovelos levemente dobrados.', 'Fortalece a parte de trás do ombro e a postura.'] },
    { n: 'Elevação lateral com halteres', sets: 3, reps: '12-15', rest: 60, img: 'Side_Lateral_Raise', yt: 'elevação lateral execução correta',
      cues: ['Cotovelos levemente dobrados, carga que permita controle.', 'Suba só até a altura dos ombros.', 'Ombros longe das orelhas, sem encolher.'] },
    { n: 'Dead bug (deitado, braços e pernas alternados)', sets: 3, reps: '8-10', rest: 45, img: 'Dead_Bug', yt: 'dead bug exercício abdominal iniciante',
      cues: ['Deitado de costas, joelhos dobrados no ar.', 'Estique um braço e a perna do lado oposto, devagar.', 'Lombar encostada no chão; solte o ar ao esticar.'] }
  ]},
  IB: { name: 'Inferior B', tag: 'Estabilidade, posterior e pé', ex: [
    aquec,
    { n: 'Agachamento no banco, com halter no peito', sets: 3, reps: '8-10', rest: 90, img: 'Dumbbell_Squat_To_A_Bench', yt: 'agachamento no banco com halter goblet',
      cues: ['Halter junto ao peito, coluna longa.', 'Sente de leve no banco sem relaxar e suba.', 'Joelhos seguem a direção dos pés.'] },
    { n: 'Stiff com halteres', sets: 3, reps: '8-10', rest: 90, img: 'Stiff-Legged_Dumbbell_Deadlift', yt: 'stiff com halteres execução correta',
      cues: ['Joelhos quase retos, quadril vai para trás.', 'Halteres rentes às pernas, coluna neutra.', 'Desça até sentir o posterior alongar e volte apertando o glúteo.'] },
    { n: 'Elevação do quadril com uma perna', sets: 3, reps: '8-10', rest: 60, img: 'Single_Leg_Glute_Bridge', yt: 'ponte glúteo unilateral execução correta',
      cues: ['Deitada, uma perna esticada e a outra com o pé no chão.', 'Suba o quadril sem girar o corpo.', 'Faça 8 a 10 de cada lado.'] },
    { n: 'Mesa flexora sentado', sets: 3, reps: '10-12', rest: 90, img: 'Seated_Leg_Curl', yt: 'cadeira flexora sentado execução correta',
      cues: ['Costas no encosto.', 'Dobre os joelhos com força e volte devagar.'] },
    { n: 'Cadeira adutora', sets: 3, reps: '12-15', rest: 60, img: 'Thigh_Adductor', yt: 'cadeira adutora execução correta',
      cues: ['Costas no encosto.', 'Feche as pernas devagar, sem impulso.', 'Ajuda a estabilidade e o controle da rotação do quadril.'] },
    { n: 'Equilíbrio em uma perna, na meia-ponta', unit: 'seg', sets: 2, reps: '20-30', rest: 45, img: '', yt: 'equilíbrio em uma perna meia ponta exercício bailarina',
      cues: ['Perto de uma barra para apoio leve.', 'Suba na meia-ponta, alinhada, e segure.', 'Faça dos dois lados. Pare se sentir dor no tornozelo ou no tendão.'] },
    { n: 'Abdominal na polia', sets: 3, reps: '10-12', rest: 60, img: 'Cable_Crunch', yt: 'abdominal na polia alta execução correta',
      cues: ['Ajoelhada, corda junto à cabeça.', 'Encolha o tronco levando as costelas ao quadril.', 'Não puxe com os braços.'] }
  ]}
};

// séries: aquecimento sempre 1; semanas 1-2 e 8 (semana leve) com até 2 séries; no meio, o número completo
function setsFor(ex, wk) {
  if (ex.unit === 'min') return 1;
  return (wk <= 2 || wk === PROGRAM_WEEKS) ? Math.min(ex.sets || 3, 2) : (ex.sets || 3);
}

function phaseInfo(wk) {
  if (wk <= 2) return { name: 'Adaptação', warn: true, tip: '2 séries com carga leve, aprendendo os aparelhos e a técnica. Pare com 3 a 4 repetições sobrando.' };
  if (wk < PROGRAM_WEEKS) return { name: 'Progressão', tip: 'Séries completas. Quando fechar todas as séries no topo das repetições, com 1 a 2 sobrando e sem dor, suba a carga no treino seguinte.' };
  if (wk === PROGRAM_WEEKS) return { name: 'Semana leve', warn: true, tip: '2 séries com cerca de 70% da carga. Recupera o corpo para o próximo ciclo.' };
  return { name: 'Fim do ciclo', warn: true, tip: 'Hora de reavaliar metas, agenda de ensaios e cargas antes de começar outro ciclo.' };
}
